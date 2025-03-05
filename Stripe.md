Cartões de Teste do Stripe
Durante o desenvolvimento, use estes cartões de teste do Stripe para simular diferentes cenários de pagamento.

Cartões para Pagamento Bem-Sucedido
Tipo de Cartão NúmeroData de Expiração CVV CEP
Visa 4242 4242 4242 4242 Qualquer futura Qualquer Qualquer
Mastercard 5555 5555 5555 4444 Qualquer futura Qualquer Qualquer
American Express 3782 822463 10005 Qualquer futura Qualquer Qualquer

Cartões para Testar Erros
Cenário Número Cartão 
recusado 4000 0000 0000 0002
Cartão expirado 4000 0000 0000 0069
Fundos insuficientes 4000 0000 0000 9995
Erro de processamento 4000 0000 0000 0119

Como Usar 
No ambiente de teste do Stripe, usar estes cartões sem riscos
Use qualquer data futura para "Data de Expiração"
Use qualquer número de 3 dígitos para o "CVV"
Use qualquer CEP válido
