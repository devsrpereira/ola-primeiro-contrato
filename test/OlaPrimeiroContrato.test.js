// test/OlaPrimeiroContrato.test.js
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect } = chai;

const { ethers } = require("hardhat");

describe("OlaPrimeiroContrato", function () {
  let OlaFactory;
  let contrato;
  let owner;
  let addr1;
  let provider;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    provider = ethers.provider;

    OlaFactory = await ethers.getContractFactory("OlaPrimeiroContrato", owner);
    contrato = await OlaFactory.deploy();
    await contrato.deployed();
  });

  it("deploy: dono imutavel e numero inicial zero", async function () {
    expect(await contrato.dono()).to.equal(owner.address);

    // lerNumero retorna BigNumber -> convertemos para number
    const numero = (await contrato.lerNumero()).toNumber();
    expect(numero).to.equal(0);

    const ultima = await contrato.ultimaAlteracao();
    expect(ultima.toNumber()).to.be.a("number");
  });

  it("onlyOwner: definirNumero reverte para não-dono", async function () {
    await expect(contrato.connect(addr1).definirNumero(10)).to.be.revertedWith("Not owner");
  });

  it("definirNumero: grava e emite evento", async function () {
    await expect(contrato.definirNumero(42)).to.emit(contrato, "NumeroAlterado");
    expect((await contrato.lerNumero()).toNumber()).to.equal(42);
  });

  it("somarNumero: incrementa e emite evento", async function () {
    await contrato.definirNumero(5);
    const tx = await contrato.somarNumero(7);
    await tx.wait();

    expect((await contrato.lerNumero()).toNumber()).to.equal(12);
    await expect(tx).to.emit(contrato, "NumeroAlterado");
  });

  it("receive/fallback: contrato aceita ETH e atualiza saldo", async function () {
    // enviar ETH simples (trigger receive)
    const tx1 = await owner.sendTransaction({
      to: contrato.address,
      value: ethers.utils.parseEther("0.01"),
    });
    await tx1.wait();

    const saldo = await provider.getBalance(contrato.address);
    expect(saldo).to.equal(ethers.utils.parseEther("0.01"));

    // enviar com calldata para acionar fallback
    const tx2 = await owner.sendTransaction({
      to: contrato.address,
      value: ethers.utils.parseEther("0.005"),
      data: "0x1234",
    });
    await tx2.wait();

    const saldo2 = await provider.getBalance(contrato.address);
    expect(saldo2).to.equal(ethers.utils.parseEther("0.015"));
  });

  it("withdraw: dono saca para sua conta e evento é emitido", async function () {
    await owner.sendTransaction({
      to: contrato.address,
      value: ethers.utils.parseEther("0.02"),
    });

    const saldoContratoAntes = await provider.getBalance(contrato.address);
    expect(saldoContratoAntes).to.equal(ethers.utils.parseEther("0.02"));

    const ownerBalAntes = await provider.getBalance(owner.address);

    const tx = await contrato.withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;
    const txDetails = await provider.getTransaction(tx.hash);
    const gasPrice = txDetails.gasPrice ? txDetails.gasPrice : receipt.effectiveGasPrice;
    const gasCost = gasUsed.mul(gasPrice);

    const ownerBalDepois = await provider.getBalance(owner.address);

    expect(ownerBalDepois).to.equal(ownerBalAntes.add(saldoContratoAntes).sub(gasCost));
    expect(await provider.getBalance(contrato.address)).to.equal(0);
    await expect(tx).to.emit(contrato, "SaqueRealizado");
  });

  it("withdraw: não-dono não pode sacar", async function () {
    await owner.sendTransaction({
      to: contrato.address,
      value: ethers.utils.parseEther("0.005"),
    });

    await expect(contrato.connect(addr1).withdraw()).to.be.revertedWith("Not owner");
  });
});
