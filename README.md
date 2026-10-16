## Atualização V70

Leitor de PDF por **posição livre**. O Pacote É Mato não depende mais de a coluna de código ficar à direita, o endereço no centro ou o número da parada à esquerda. O leitor identifica códigos BR válidos, reconstrói códigos quebrados em itens/linhas, detecta endereços semanticamente válidos e associa cada pacote ao endereço mais próximo pela estrutura visual/ordem de leitura.

Mantidos como fallback os leitores anteriores de Circuit, Spoke e layouts tabulares. A validação continua recusando falsos códigos como `BR-050`.

Limite: PDFs que são somente imagem/scan, sem camada de texto, ainda precisam de OCR.
