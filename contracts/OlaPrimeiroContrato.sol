// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title OlaPrimeiroContrato - Exemplo didático de Solidity 101
/// @author Saulo Roberto De Souza Pereira | Blockchain Solutions Architect
/// @notice Contrato de exemplo que demonstra armazenamento de estado, controle de acesso, recebimento/saque de ETH e eventos.
/// @dev Versão intencionalmente simples para uso didático e testes com Hardhat.
contract OlaPrimeiroContrato {
    // --- Estado ---
    uint256 private numero;               // número armazenado
    address public immutable dono;        // dono definido no deploy
    uint256 public ultimaAlteracao;       // timestamp da última modificação

    // --- Eventos ---
    event NumeroAlterado(address indexed autor, uint256 novoValor, uint256 momento);
    event SaqueRealizado(address indexed destinatario, uint256 valor, uint256 momento);
    event Recebido(address indexed remetente, uint256 valor, bytes dados);

    // --- Construtor ---
    constructor() {
        dono = msg.sender;
        ultimaAlteracao = block.timestamp;
        // numero já inicializa como 0 por padrão
    }

    // --- Modificadores ---
    modifier onlyOwner() {
        require(msg.sender == dono, "Not owner");
        _;
    }

    // --- Funções de escrita / gerenciamento ---
    /// @notice Define um novo valor para `numero`.
    /// @dev Apenas o dono pode executar; emite `NumeroAlterado`.
    /// @param _novoNumero Novo valor a ser armazenado.
    function definirNumero(uint256 _novoNumero) public onlyOwner {
        numero = _novoNumero;
        ultimaAlteracao = block.timestamp;
        emit NumeroAlterado(msg.sender, _novoNumero, block.timestamp);
    }

    /// @notice Soma um valor positivo ao `numero`.
    /// @dev Requer `valor > 0`. Emite `NumeroAlterado`.
    /// @param valor Valor a somar.
    function somarNumero(uint256 valor) public onlyOwner {
        require(valor > 0, "Valor precisa ser > 0");
        numero += valor;
        ultimaAlteracao = block.timestamp;
        emit NumeroAlterado(msg.sender, numero, block.timestamp);
    }

    /// @notice Permite ao dono sacar todo o saldo do contrato.
    /// @dev Usa o padrão `call` para transferência segura e emite `SaqueRealizado`.
    function withdraw() public onlyOwner {
        uint256 saldo = address(this).balance;
        require(saldo > 0, "Sem saldo disponivel");

        (bool ok, ) = payable(dono).call{value: saldo}("");
        require(ok, "Falha no envio de Ether");

        emit SaqueRealizado(dono, saldo, block.timestamp);
    }

    // --- Funções de leitura ---
    /// @notice Lê o valor atual de `numero`.
    /// @return O inteiro armazenado em `numero`.
    function lerNumero() public view returns (uint256) {
        return numero;
    }

    /// @notice Saldo do contrato em wei.
    /// @return Saldo do contrato.
    function saldoContrato() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Retorna o saldo (wei) do endereço `dono`.
    /// @dev Esta função é `internal` por intenção didática (não expõe a conta do dono publicamente via função).
    function _saldoDono() internal view onlyOwner returns (uint256) {
        return dono.balance;
    }

    // --- Recebimento de ETH ---
    /// @notice Permite que o contrato receba ETH sem dados.
    receive() external payable {
        emit Recebido(msg.sender, msg.value, "");
    }

    /// @notice Fallback para chamadas com dados desconhecidos. Emite evento com calldata.
    fallback() external payable {
        emit Recebido(msg.sender, msg.value, msg.data);
    }
}
