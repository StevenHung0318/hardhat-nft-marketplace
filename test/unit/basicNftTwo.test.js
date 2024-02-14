const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Two Unit Tests", function () {
          let basicNftTwo, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["basicnft"])
              basicNftTwo = await ethers.getContract("BasicNftTwo")
          })

          describe("Constructor", () => {
              it("Initializes the NFT Correctly.", async () => {
                  const name = await basicNftTwo.name()
                  const symbol = await basicNftTwo.symbol()
                  const tokenCounter = await basicNftTwo.getTokenCounter()
                  assert.equal(name, "Dogie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })
          //test02
          describe("Mint NFT", () => {
              beforeEach(async () => {
                  const txResponse = await basicNftTwo.mintNft()
                  await txResponse.wait(1)
              })
              it("Allows users to mint an NFT, and updates appropriately", async function () {
                  const tokenURI = await basicNftTwo.tokenURI(0)
                  const tokenCounter = await basicNftTwo.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNftTwo.TOKEN_URI())
              })
              it("Show the correct balance and owner of an NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNftTwo.balanceOf(deployerAddress)
                  const owner = await basicNftTwo.ownerOf("0")

                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })
