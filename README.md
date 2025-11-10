# ola-primeiro-contrato

**OlaPrimeiroContrato** — Primeiro contrato didático da trilha *Solidity 101*.

**Autor:** Saulo Roberto De Souza Pereira | Blockchain Solutions Architect  
**Compiler:** ^0.8.17  
**Framework:** Hardhat  
**License:** MIT

---

## Resumo
Contrato simples para demonstrar:
- Armazenamento de estado (`numero`, `ultimaAlteracao`)
- Controle de acesso (`onlyOwner`)
- Transferência segura de ETH usando `call`
- Eventos para auditoria (`NumeroAlterado`, `SaqueRealizado`, `Recebido`)
- `receive` e `fallback` implementados
- Documentação NatSpec para exposição em block explorers

---

## Como rodar localmente
1. Clone o repositório e entre na pasta:
git clone <seu-repo-url>
cd ola-primeiro-contrato

2. Instale dependências:
npm install

3. Compile:
npm run compile

4. Testes:
npm test

5. Deploy local (Hardhat):
npx hardhat run scripts/deploy.js --network hardhat

Para deploy em testnet, configure GOERLI_RPC_URL e PRIVATE_KEY em hardhat.config.js (ou use variáveis de ambiente) e rode com --network goerli (exemplo).

---

## Funções principais
- `definirNumero(uint256 _novoNumero)` — define numero (onlyOwner). Emite NumeroAlterado.
- `somarNumero(uint256 valor)` — soma valor a numero (onlyOwner). Emite NumeroAlterado.
- `lerNumero()` — retorna numero.
- `saldoContrato()` — retorna saldo do contrato (wei).
- `withdraw()` — envia todo o saldo para dono (onlyOwner). Emite SaqueRealizado.
- `receive()` / `fallback()` — recebem ETH e emitem Recebido.

---

## Testes — o que foi coberto
- Deploy: dono definido e numero inicial = 0.
- Acesso: onlyOwner aplicado.
- Modificações: definirNumero e somarNumero e emissão de eventos.
- Recebimento: receive e fallback aceitam ETH.
- Saque: withdraw transfere o saldo ao dono e emite evento.

---

## Próximos passos / melhorias sugeridas
- Adicionar verificação de limite máximo/minimo para numero.
- Implementar pausabilidade (pausable).
- Adicionar script para deploy automático em testnet via .env.
- Gerar documentação a partir dos comentários NatSpec (solidity-docgen ou solidity-docgen + hardhat plugin).

---

## Licença
- MIT
