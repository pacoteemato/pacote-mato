# Pacote É Mato — V81 HOTFIX FINAL 6

Versão V81 com a **regra definitiva de paradas físicas** aplicada sobre o `Pacote-Em-Mato-V81-HOTFIX-FINAL-2`.

## Regra definitiva de parada física

A identidade da parada física considera **somente**:

```text
LOGRADOURO NORMALIZADO + NÚMERO PRINCIPAL DO IMÓVEL
```

Apartamento, bloco, torre, sala, loja, casa interna, unidade, andar e demais complementos **não participam da chave de agrupamento**. Eles continuam preservados como informações de entrega para exibição ao motorista.

Exemplo:

```text
Rua Ancara, 105, Bloco 3, Apto 903
Rua Ancara, 105, Bloco 1, Apto 501
=> UMA PARADA FÍSICA
```

Se o número principal não puder ser determinado com segurança, a entrega fica isolada; o sistema não agrupa somente pelo nome da rua e nunca usa número de apartamento/bloco como substituto do número principal.

## Pacotes, entregas e Bipagem

- A formação continua seguindo **PACOTE → ENTREGA ORIGINAL DO PDF → PARADA FÍSICA**.
- Vários BRs de uma mesma entrega permanecem dentro da entrega original.
- `entregaOriginalPorPacote[BR]` continua preservando a numeração original do PDF.
- Uma parada com `pacotes.length > 1` é uma **PARADA MÚLTIPLA**.
- Agrupar pacotes na mesma parada **não** os bipa juntos. Cada BR continua independente.
- `BIPADOS` e `FALTAM` contam pacotes; `PARADAS FÍSICAS` conta destinos físicos.
- `js/bipagem/`: **0 arquivos modificados** nesta revisão.


## Ajuste de numeração e alerta de múltiplos — HOTFIX FINAL 4

- A regra física `logradouro normalizado + número principal` permanece **inalterada**.
- Na tela **Paradas & Endereços**, a identidade principal passa a ser a **ENTREGA ORIGINAL DO PDF**, e não o índice interno da parada física.
- Exemplo: a parada física interna 108 pode conter as entregas 119 e 120, mas o motorista vê **ENTREGA 119**, **ATENÇÃO** e **Também: 120**.
- O resumo continua mostrando a quantidade real de **paradas físicas** e **pacotes**.
- Uma parada é destacada com **ATENÇÃO** quando `pacotes.length > 1`.
- Complementos (bloco, apartamento, torre etc.) continuam visíveis por entrega, mas não afetam o agrupamento.
- Na voz da Bipagem, um pacote de endereço múltiplo fala somente `NUMERO_ORIGINAL. Atenção.`. Ex.: `121. Atenção.`
- A voz não lê outros números, bloco, apartamento nem quantidade.
- `processarCodigo` permaneceu byte a byte igual ao HOTFIX FINAL 3; cada BR continua bipado individualmente.
- `js/bipagem/`: **0 arquivos modificados**.

## Validação desta revisão

- Regra sintética completa do manifesto Spoke de 123 pacotes: **107 paradas / 8 múltiplas / 24 pacotes em múltiplas**.
- `91.pdf` real processado pelo parser do app: **102 pacotes / 78 paradas / 18 múltiplas / 42 pacotes em múltiplas**.
- Apartamentos/blocos diferentes no mesmo logradouro+número permaneceram na mesma parada.
- Todos os BRs permaneceram independentes.
- A otimização, mapa, login, navigation-active e manobras do HOTFIX FINAL 2 não foram alterados por esta revisão, salvo o novo cache-buster de `app.js`.

Consulte `docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md` para os testes, comparação e limitações.


## Ajuste do ícone do veículo / navigation-active

Este hotfix mantém toda a lógica da V81 HOTFIX FINAL 4 e altera **somente a apresentação visual do ícone do motorista/veículo** em `navigation-active`.

Resumo do ajuste:

- substitui o triângulo pontudo por um **SVG próprio** com corpo arredondado e frente suave;
- preenchimento em **verde da marca**, contorno branco e sombra discreta;
- mantém rotação suave pelo `headingVisual`;
- não altera GPS bruto, map matching, recálculo, desvio ou coordenadas reais;
- preserva mapa, login, navigation-active, manobras, otimização e Bipagem.

## HOTFIX FINAL 6 — mapa, manobras e voz GPS

Base: `Pacote-Em-Mato-V81-HOTFIX-FINAL-5`.

Este hotfix altera apenas a experiência de navegação interna:

- mapa com hierarquia visual de vias (`motorway/trunk > primary > secondary > tertiary > residential`);
- setas SVG próprias e grandes para manobras reais;
- frase de navegação em português baseada no `type` real do Geoapify;
- segunda manobra quando útil;
- módulo separado `js/navegacao/voz-navegacao.js` para TTS GPS;
- avisos longe/perto/agora com antirrepetição;
- preferência local do botão `Voz ativa`.

Permanecem congelados: Bipagem, scanner, `processarCodigo()`, `entregaOriginalPorPacote`, múltiplos, regra logradouro+número, ATENÇÃO, voz da Bipagem, login/sessão, histórico, importação e otimização.

O marcador de veículo aprovado no HOTFIX FINAL 5 permanece exatamente o mesmo.
