const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const RnentrantVulnerable_arguments = []
    const RnentrantVulnerable = await deploy("ReentrantVulnerable", {
        from: deployer,
        args: RnentrantVulnerable_arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(RnentrantVulnerable.address, RnentrantVulnerable_arguments)
    }
    log("----------------------------------------------------")
    const Attack_arguments = [RnentrantVulnerable.address]
    const Attack = await deploy("Attack", {
        from: deployer,
        args: Attack_arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(Attack.address, Attack_arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "reentrant"]
