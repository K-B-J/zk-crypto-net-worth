import hre, { ethers } from "hardhat"
import { writeFileSync, existsSync, mkdirSync } from "fs"

async function main() {
    const ZKCryptoNetWorth = await ethers.getContractFactory("ZKCryptoNetWorth")
    const zKCryptoNetWorth = await ZKCryptoNetWorth.deploy()
    await zKCryptoNetWorth.deployTransaction.wait(5)
    await hre.run("verify:verify", {
        address: zKCryptoNetWorth.address,
    })
    const zKCryptoNetWorthData = JSON.stringify({
        address: zKCryptoNetWorth.address,
        abi: JSON.parse(zKCryptoNetWorth.interface.format("json") as string),
    })
    const directory = "./data/"
    const fileName =
        "zKCryptoNetWorth" +
        hre.hardhatArguments.network?.charAt(0).toUpperCase() +
        hre.hardhatArguments.network?.slice(1) +
        ".json"

    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true })
    }
    writeFileSync(directory + fileName, zKCryptoNetWorthData)
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
