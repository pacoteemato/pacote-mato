'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');

function ok(cond, msg) { if (!cond) throw new Error(msg); console.log('OK  ' + msg); }
function sha(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function functionBlock(src, name) {
  const start = src.indexOf(`    function ${name}(`);
  if (start < 0) throw new Error(`função não encontrada: ${name}`);
  let i = src.indexOf('{', start), depth = 0, quote = null, esc = false, line = false, block = false;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (quote) { if (esc) { esc = false; continue; } if (c === '\\') { esc = true; continue; } if (c === quote) quote = null; continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i + 1).replace(/^    /gm, '');
  }
  throw new Error(`fim não encontrado: ${name}`);
}

// Executa as funções reais do app para reconstrução pacote -> entrega -> parada.
const helpersStart = app.indexOf('    function removerAcentosPdfV71');
const helpersEnd = app.indexOf('    function agruparItensEmLinhasPdfV71', helpersStart);
let code = functionBlock(app, 'normalizarCodigoPacoteBr') + '\n';
code += app.slice(helpersStart, helpersEnd).replace(/^    /gm, '') + '\n';
code += functionBlock(app, 'reconstruirEntregasOriginaisV81') + '\n';
code += 'this.H={reconstruirEntregasOriginaisV81,decomporEnderecoFisicoPdfV71};';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const H = ctx.H;

const BR = n => `BR${String(n).padStart(12, '0')}A`;
const registros = [
  // A mesma entrega 119 veio fragmentada em três registros visuais diferentes.
  { numeroParada: 1, numeroOriginalPdf: 119, origemLeitura: 'deterministico-v73', endereco: 'Rua X, 100, Apto 10', codigos: [BR(1)], _indice: 0 },
  { numeroParada: 2, numeroOriginalPdf: 119, origemLeitura: 'deterministico-v73', endereco: 'Rua X, 100, APTO 10', codigos: [BR(2)], _indice: 1 },
  { numeroParada: 3, numeroOriginalPdf: 119, origemLeitura: 'deterministico-v73', endereco: 'Rua X, 100, Apartamento 10', codigos: [BR(3)], _indice: 2 },
  { numeroParada: 4, numeroOriginalPdf: 120, origemLeitura: 'deterministico-v73', endereco: 'Rua X, 100, AP 10', codigos: [BR(4)], _indice: 3 },
  { numeroParada: 5, numeroOriginalPdf: 121, origemLeitura: 'deterministico-v73', endereco: 'Rua X, 100, Apto 20', codigos: [BR(5)], _indice: 4 },
  { numeroParada: 6, numeroOriginalPdf: 121, origemLeitura: 'deterministico-v73', endereco: 'Rua X, 100, Apt 20', codigos: [BR(6)], _indice: 5 }
];
const entregas = H.reconstruirEntregasOriginaisV81(registros);
ok(entregas.length === 3, '6 BRs foram reconstruídos em 3 entregas originais, não 6 entregas');
const e119 = entregas.find(e => e.numeroOriginalPdf === 119);
const e120 = entregas.find(e => e.numeroOriginalPdf === 120);
const e121 = entregas.find(e => e.numeroOriginalPdf === 121);
ok(e119 && e119.codigos.length === 3, 'entrega 119 mantém seus 3 pacotes juntos');
ok(e120 && e120.codigos.length === 1, 'entrega 120 mantém 1 pacote');
ok(e121 && e121.codigos.length === 2, 'entrega 121 mantém seus 2 pacotes juntos');

const gruposFisicos = new Map();
for (const e of entregas) {
  if (!gruposFisicos.has(e.chaveFisica)) gruposFisicos.set(e.chaveFisica, []);
  gruposFisicos.get(e.chaveFisica).push(e);
}
ok(gruposFisicos.size === 1, 'mesma Rua X, 100 gera UMA parada mesmo com aptos 10 e 20');
const grupoRua100 = [...gruposFisicos.values()][0];
ok(grupoRua100.length === 3, 'entregas PDF 119, 120 e 121 compartilham a mesma parada física');
ok(grupoRua100.reduce((n,e)=>n+e.codigos.length,0) === 6, 'a parada física mantém os 6 pacotes independentes');

// entregaOriginalPorPacote deve permanecer independente da posição física.
const entregaOriginalPorPacote = {};
for (const e of entregas) for (const codigo of e.codigos) entregaOriginalPorPacote[codigo] = e.numeroOriginalPdf;
ok(entregaOriginalPorPacote[BR(1)] === 119 && entregaOriginalPorPacote[BR(3)] === 119, 'BRs da entrega 119 continuam apontando para a entrega PDF 119');
ok(entregaOriginalPorPacote[BR(4)] === 120 && entregaOriginalPorPacote[BR(6)] === 121, 'numeração original por pacote permanece correta nas demais entregas');

// Fragmentação de complemento dentro da MESMA entrega não pode separar os BRs.
const fragmentada = H.reconstruirEntregasOriginaisV81([
  { numeroParada: 10, numeroOriginalPdf: 200, origemLeitura: 'deterministico-v73', endereco: 'Rua A, 50, Apto', codigos: [BR(10)], _indice: 0 },
  { numeroParada: 11, numeroOriginalPdf: 200, origemLeitura: 'deterministico-v73', endereco: 'Rua A, 50, Apto 501', codigos: [BR(11)], _indice: 1 }
]);
ok(fragmentada.length === 1 && fragmentada[0].codigos.length === 2, 'complemento fragmentado da mesma entrega mantém os pacotes juntos');
ok(fragmentada[0].unidadeNormalizada === 'apt:501', 'versão completa do complemento vence fragmento incompleto da mesma entrega');

// Entregas diferentes com mesmo logradouro+número ficam juntas, independente do complemento.
const ancara = H.reconstruirEntregasOriginaisV81([
  { numeroParada: 20, numeroOriginalPdf: 119, origemLeitura: 'deterministico-v73', endereco: 'R Ancara, 105, Bloco 1, Apto 501', codigos: [BR(20)], _indice: 0 },
  { numeroParada: 21, numeroOriginalPdf: 120, origemLeitura: 'deterministico-v73', endereco: 'Rua Ancara, 105, BL 1, APTO 501', codigos: [BR(21)], _indice: 1 },
  { numeroParada: 22, numeroOriginalPdf: 121, origemLeitura: 'deterministico-v73', endereco: 'R Ancara, 105, Bloco 2, Apto 1208', codigos: [BR(22)], _indice: 2 }
]);
ok(ancara[0].chaveFisica === ancara[1].chaveFisica && ancara[1].chaveFisica === ancara[2].chaveFisica, 'Ancara 105: blocos/apartamentos diferentes continuam na MESMA parada');
ok(ancara.every(e => e.chaveFisica === e.chaveBase), 'chave física final é somente logradouro normalizado + número principal');

// Se a mesma entrega original trouxer ruas/números contraditórios, bloqueia em vez de criar uma parada por BR.
let conflito = '';
try {
  H.reconstruirEntregasOriginaisV81([
    { numeroParada: 30, numeroOriginalPdf: 300, origemLeitura: 'deterministico-v73', endereco: 'Rua A, 10', codigos: [BR(30)], _indice: 0 },
    { numeroParada: 31, numeroOriginalPdf: 300, origemLeitura: 'deterministico-v73', endereco: 'Rua B, 20', codigos: [BR(31)], _indice: 1 }
  ]);
} catch (e) { conflito = String(e.message || e); }
ok(conflito.startsWith('ENTREGA_ORIGINAL_ENDERECO_CONFLITANTE'), 'endereço contraditório da mesma entrega é bloqueado, não fragmentado em paradas');

// Sem número original comprovado no V73: não inventa que dois registros são a mesma entrega.
const semOriginal = H.reconstruirEntregasOriginaisV81([
  { numeroParada: 1, numeroOriginalPdf: null, origemLeitura: 'deterministico-v73', endereco: 'Rua Z, 9', codigos: [BR(40)], _indice: 0 },
  { numeroParada: 2, numeroOriginalPdf: null, origemLeitura: 'deterministico-v73', endereco: 'Rua Z, 9', codigos: [BR(41)], _indice: 1 }
]);
ok(semOriginal.length === 2, 'sem número original confirmado, registros V73 não são fundidos como uma única entrega por suposição');

// Contrato visual/contadores no app: bipados/faltam = pacotes; paradas = mapa físico.
ok(/const bip = pacotesBipados\.size;[\s\S]*const tot = todosPacotes\.size;[\s\S]*const paradas = Object\.keys\(mapaRotas\)\.length;/.test(app), 'contadores distinguem pacotes bipados, total de pacotes e paradas físicas');
ok(/valFaltam'\)\.innerText = Math\.max\(0, tot - bip\)/.test(app), 'FALTAM calcula pacotes restantes, não paradas');
ok(/dados\.quantidadePacotes > 1/.test(app), 'Paradas Múltiplas usa pacotes.length > 1 quando existem códigos BR');

// Scanner/Bipagem modular continua byte a byte igual à base aprovada.
// Hashes embutidos deixam o teste autocontido também depois de extrair o ZIP final.
const BIPAGEM_APROVADA = {
  'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
  'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
  'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610'
};
for (const [rel,hash] of Object.entries(BIPAGEM_APROVADA)) {
  ok(sha(path.join(ROOT, rel)) === hash, `Bipagem 0 alterações: ${rel}`);
}

// A rotina real de bipagem continua adicionando apenas o BR identificado ao Set.
const proc = functionBlock(app, 'processarCodigo');
ok(/pacotesBipados\.add\(identificado\)/.test(proc), 'processarCodigo bipa somente o código identificado');
ok(!/listaParada\.forEach[\s\S]*pacotesBipados\.add/.test(proc), 'processarCodigo não marca os demais pacotes da parada automaticamente');

console.log('\nV81 HOTFIX — pacotes/entregas/paradas concluído.');
