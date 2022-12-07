import expressAsyncHandler from "express-async-handler"
import {
    isUniqueUsername,
    getPrimaryWalletAddress,
    isUniquePublicKey,
    setAccount,
} from "../utils/zKCryptoNetWorth.js"
import { ethers } from "ethers"
import { genKeys, encrypt, decrypt } from "../utils/cryptography.js"
import { generateToken } from "../utils/jwt.js"
import { ADMIN_USERNAMES } from "../env.js"

const login = expressAsyncHandler(async (req, res, next) => {
    const { username, primaryWalletAddress, password } = req.body
    if (username == undefined) {
        return res.status(200).json({
            error: "Authentication data missing",
            message: "Username is not provided",
        })
    }
    if (primaryWalletAddress == undefined) {
        return res.status(200).json({
            error: "Authentication data missing",
            message: "Primary wallet address is not provided",
        })
    }
    if (password == undefined) {
        return res.status(200).json({
            error: "Authentication data missing",
            message: "Password is not provided",
        })
    }
    if (ethers.utils.isAddress(primaryWalletAddress)) {
        if (password.length == 1704) {
            let primaryWalletAddressFetched = await getPrimaryWalletAddress(
                username
            )
            console.log(primaryWalletAddressFetched)
            if (primaryWalletAddressFetched.success) {
                try {
                    const decryptedPrimaryWalletAddress = decrypt(
                        password,
                        primaryWalletAddressFetched.result
                    )
                    if (primaryWalletAddress == decryptedPrimaryWalletAddress) {
                        let isAdmin = false
                        ADMIN_USERNAMES.forEach((adminUsername) => {
                            if (username == adminUsername) {
                                isAdmin = true
                            }
                        })
                        return res.status(200).json({
                            message: "Authenticated successfully!",
                            data: {
                                token: generateToken({
                                    username,
                                    privateKey: password,
                                    isAdmin,
                                }),
                            },
                        })
                    } else {
                        return res.status(200).json({
                            error: "Invalid credentials provided",
                            message:
                                "The password or the primary wallet address do not match with the username provided",
                        })
                    }
                } catch (error) {
                    return res.status(200).json({
                        error: "Invalid password",
                        message:
                            "The password provided is incorrect or corrupted",
                    })
                }
            } else {
                return res.status(200).json({
                    error: "Primary wallet address fetch from blockchain failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(200).json({
                error: "Invalid password",
                message: "The password provided is incorrect or corrupted",
            })
        }
    } else {
        return res.status(200).json({
            error: "Invalid primary wallet address",
            message:
                "The primary wallet address provided is not a valid wallet address",
        })
    }
})

export { login }