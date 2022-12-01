import { expect } from "chai"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { ethers } from "hardhat"

describe("ZKCryptoNetWorth Contract", () => {
    const deployZKCryptoNetWorthFixture = async () => {
        const ZKCryptoNetWorth = await ethers.getContractFactory(
            "ZKCryptoNetWorth"
        )
        const [owner, addr1] = await ethers.getSigners()
        const zKCryptoNetWorth = await ZKCryptoNetWorth.deploy()
        await zKCryptoNetWorth.deployed()
        return { ZKCryptoNetWorth, zKCryptoNetWorth, owner, addr1 }
    }

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            const { zKCryptoNetWorth, owner } = await loadFixture(
                deployZKCryptoNetWorthFixture
            )
            expect(await zKCryptoNetWorth.owner()).to.equal(owner.address)
        })
    })

    describe("Transactions", () => {
        describe("isUniquePublicKey function", () => {
            it("Should return true", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                expect(
                    await zKCryptoNetWorth.isUniquePublicKey("abc")
                ).to.equal(true)
            })
            it("Should return false", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKCryptoNetWorth.isUniquePublicKey("abc")
                ).to.equal(false)
            })
        })

        describe("isUniqueUsername function", () => {
            it("Should return true", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                expect(
                    await zKCryptoNetWorth.isUniqueUsername("kevin")
                ).to.equal(true)
            })
            it("Should return false", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKCryptoNetWorth.isUniqueUsername("kevin")
                ).to.equal(false)
            })
        })

        describe("createAccount function", () => {
            it("Should return error Username not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setAccount("", "", "")
                ).to.be.revertedWith("Username not provided")
            })
            it("Should return error Public key not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setAccount("kevin", "", "")
                ).to.be.revertedWith("Public key not provided")
            })
            it("Should return error Primary wallet address not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setAccount("kevin", "abc", "")
                ).to.be.revertedWith("Primary wallet address not provided")
            })
            it("Should return error Account with the given username already exists", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                ).to.be.revertedWith(
                    "Account with the given username already exists"
                )
            })
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKCryptoNetWorth, addr1 } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth
                        .connect(addr1)
                        .setAccount("kevin", "123", "123")
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should set account", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKCryptoNetWorth.isUniqueUsername("kevin")
                ).to.equal(false)
            })
        })

        describe("getAccount function", () => {
            it("Should return the User struct", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    (await zKCryptoNetWorth.getAccount("kevin"))
                        .primaryWalletAddress
                ).to.equal("xyz")
            })
        })

        describe("getPublicKey function", () => {
            it("Should return error Account with the given username does not exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.getPublicKey("")
                ).to.be.revertedWith(
                    "Account with the given username does not exist"
                )
            })
            it("Should return public key", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                expect(await zKCryptoNetWorth.getPublicKey("kevin")).to.equal(
                    "abc"
                )
            })
        })

        describe("getPrimaryWalletAddress function", () => {
            it("Should return primary wallet address", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKCryptoNetWorth.getPrimaryWalletAddress("kevin")
                ).to.equal("xyz")
            })
        })

        describe("setSecondaryWalletAddress function", () => {
            it("Should return error Account with the given username does not exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setSecondaryWalletAddress("kevin", "xyz")
                ).to.be.revertedWith(
                    "Account with the given username does not exist"
                )
            })
            it("Should return error Secondary wallet address not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.setSecondaryWalletAddress("kevin", "")
                ).to.be.revertedWith("Secondary wallet address not provided")
            })
            it("Should set secondary wallet address", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                expect(
                    (
                        await zKCryptoNetWorth.getSecondaryWalletAddresses(
                            "kevin"
                        )
                    )[0]
                ).to.equal("xyz2")
            })
        })

        describe("removeSecondaryWalletAddress function", () => {
            it("Should return error Account with the given username does not exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.removeSecondaryWalletAddress(
                        "kevin",
                        "xyz"
                    )
                ).to.be.revertedWith(
                    "Account with the given username does not exist"
                )
            })
            it("Should return error Secondary wallet address not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.removeSecondaryWalletAddress("kevin", "")
                ).to.be.revertedWith("Secondary wallet address not provided")
            })
            it("Should remove secondary wallet address", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                await zKCryptoNetWorth.removeSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                expect(
                    (
                        await zKCryptoNetWorth.getSecondaryWalletAddresses(
                            "kevin"
                        )
                    ).length
                ).to.equal(0)
            })
        })

        describe("getSecondaryWalletAddress function", () => {
            it("Should return secondary wallet addresses", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                expect(
                    (
                        await zKCryptoNetWorth.getSecondaryWalletAddresses(
                            "kevin"
                        )
                    )[0]
                ).to.equal("xyz2")
            })
        })

        describe("setRequestMetadata function", () => {
            it("Should return error Request sender not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setRequestMetadata(
                        0,
                        "",
                        "neelansh",
                        50,
                        0,
                        true,
                        ethers.utils.formatBytes32String("")
                    )
                ).to.be.revertedWith("Request sender not provided")
            })
            it("Should return error Request receiver not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setRequestMetadata(
                        0,
                        "kevin",
                        "",
                        50,
                        0,
                        true,
                        ethers.utils.formatBytes32String("")
                    )
                ).to.be.revertedWith("Request receiver not provided")
            })
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKCryptoNetWorth, addr1 } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth
                        .connect(addr1)
                        .setRequestMetadata(
                            0,
                            "kevin",
                            "neelansh",
                            50,
                            0,
                            true,
                            ethers.utils.formatBytes32String("")
                        )
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should set request metadata", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKCryptoNetWorth.getRequestMetadata(1)).sender
                ).to.equal("kevin")
            })
            it("Should update request metadata", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    1,
                    "kevin",
                    "neelansh",
                    55,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKCryptoNetWorth.getRequestMetadata(1)).threshold
                ).to.equal(55)
            })
            it("Should return error Invalid id provided for metadata which is being updated but the id provided is invalid", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setRequestMetadata(
                        1,
                        "kevin",
                        "neelansh",
                        50,
                        0,
                        true,
                        ethers.utils.formatBytes32String("")
                    )
                ).to.be.revertedWith("Invalid id provided")
            })
        })

        describe("getLatesId function", () => {
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKCryptoNetWorth, addr1 } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.connect(addr1).getLatestId()
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should return latest Id", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                expect(await zKCryptoNetWorth.getLatestId()).to.equal(0)
            })
        })

        describe("getRequestMetadata function", () => {
            it("Should return error Invalid id provided when id is 0", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.getRequestMetadata(0)
                ).to.be.revertedWith("Invalid id provided")
            })
            it("Should return error Invalid id provided when id doesnt exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.getRequestMetadata(1)
                ).to.be.revertedWith("Invalid id provided")
            })
            it("Should return request metadata", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKCryptoNetWorth.getRequestMetadata(1)).sender
                ).to.equal("kevin")
            })
        })

        describe("getRequestMetadatas function", () => {
            it("Should return error One of the id provided is invalid when id is 0", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.getRequestMetadatas([0])
                ).to.be.revertedWith("One of the id provided is invalid")
            })
            it("Should return error One of the id provided is invalid when id doesnt exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.getRequestMetadatas([1])
                ).to.be.revertedWith("One of the id provided is invalid")
            })
            it("Should return request metadatas for one id", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKCryptoNetWorth.getRequestMetadatas([1]))[0].sender
                ).to.equal("kevin")
            })
            it("Should return request metadatas for multiple ids", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                await zKCryptoNetWorth.setRequestMetadata(
                    0,
                    "neelansh",
                    "kevin",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKCryptoNetWorth.getRequestMetadatas([1, 2]))[1]
                        .sender
                ).to.equal("neelansh")
            })
        })

        describe("setRequests function", () => {
            it("Should return error Request sender not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setRequests("", "", "", "")
                ).to.be.revertedWith("Request sender not provided")
            })
            it("Should return error Sender's account does not exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth.setRequests("kevin", "", "", "")
                ).to.be.revertedWith("Sender's account does not exist")
            })
            it("Should return error Sender's request id not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.setRequests("kevin", "", "", "")
                ).to.be.revertedWith("Sender's request id not provided")
            })
            it("Should return error Request receiver not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.setRequests("kevin", "x1", "", "")
                ).to.be.revertedWith("Request receiver not provided")
            })
            it("Should return error Receiver's account does not exist", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.setRequests("kevin", "x1", "neelansh", "")
                ).to.be.revertedWith("Receiver's account does not exist")
            })
            it("Should return error Receiver's request id not provided", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setAccount("neelansh", "abc", "xyz")
                await expect(
                    zKCryptoNetWorth.setRequests("kevin", "x1", "neelansh", "")
                ).to.be.revertedWith("Receiver's request id not provided")
            })
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKCryptoNetWorth, addr1 } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await expect(
                    zKCryptoNetWorth
                        .connect(addr1)
                        .setRequests("kevin", "x1", "neelansh", "y1")
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should set the requests", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setAccount("neelansh", "abc", "xyz")
                await zKCryptoNetWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKCryptoNetWorth.getRequests("kevin"))[1][0]
                ).to.equal("x1")
            })
        })

        describe("getRequests function", () => {
            it("Should return requests", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setAccount("neelansh", "abc", "xyz")
                await zKCryptoNetWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKCryptoNetWorth.getRequests("kevin"))[1][0]
                ).to.equal("x1")
            })
        })

        describe("getIncomingRequests function", () => {
            it("Should return incoming requests", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setAccount("neelansh", "abc", "xyz")
                await zKCryptoNetWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKCryptoNetWorth.getIncomingRequests("neelansh"))[0]
                ).to.equal("y1")
            })
        })

        describe("getOutgoingRequests function", () => {
            it("Should return outgoing requests", async () => {
                const { zKCryptoNetWorth } = await loadFixture(
                    deployZKCryptoNetWorthFixture
                )
                await zKCryptoNetWorth.setAccount("kevin", "abc", "xyz")
                await zKCryptoNetWorth.setAccount("neelansh", "abc", "xyz")
                await zKCryptoNetWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKCryptoNetWorth.getOutgoingRequests("kevin"))[0]
                ).to.equal("x1")
            })
        })
    })
})
