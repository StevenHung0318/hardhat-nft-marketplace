const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Reentrant_Attack Unit Tests", function () {
          let ReentrantVulnerable, ReentrantVulnerableContract, Attack, AttackContract
          const PRICE = ethers.utils.parseEther("3")
          const Attack_Deposite = ethers.utils.parseEther("1")

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              Attacker = accounts[1]
              await deployments.fixture(["all"])
              ReentrantVulnerableContract = await ethers.getContract("ReentrantVulnerable")
              ReentrantVulnerable = ReentrantVulnerableContract.connect(deployer)

              AttackContract = await ethers.getContract("Attack")
              Attack = AttackContract.connect(Attacker)

              await ReentrantVulnerable.deposit({ value: PRICE })
          })

          describe("ReentrantVulnerable", function () {
              it("Deposite", async function () {
                  assert((await ReentrantVulnerable.getBalance()).toString() === PRICE.toString())
              })
              it("Withdraw", async function () {
                  await ReentrantVulnerable.withdraw()
                  assert((await ReentrantVulnerable.getBalance()).toString() === "0")
              })
          })

          describe("Reentrant Attack", function () {
              it("Attack", async function () {
                  console.log(
                      "BeforeAttack_ReentrantVulnerable_Balance:",
                      (await ReentrantVulnerable.getBalance()).toString()
                  )
                  await Attack.attack({ value: Attack_Deposite })
                  console.log(
                      "AfterAttack_ReentrantVulnerable_Balance:",
                      (await ReentrantVulnerable.getBalance()).toString()
                  )
                  console.log(
                      "AfterAttack_Attack_Balance:",
                      (await Attack.getBalance()).toString()
                  )
                  assert(
                      (await Attack.getBalance()).toString() ===
                          (PRICE.toBigInt() + Attack_Deposite.toBigInt()).toString()
                  )
              })
          })
      })
