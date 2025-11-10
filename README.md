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
```bash
git clone <seu-repo-url>
cd ola-primeiro-contrato
