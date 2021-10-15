require("dotenv").config()
const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/minter.sol/CodeSpaceMinter.json")
const contractAddress = "0xCc823319f91495ea4942f26f5862520Ad86a3012"

const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // number of transactions by this Address

    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    web3.eth.sendSignedTransaction(
        signedTx.rawTransaction, 
        (err, hash) => {
            if (!err) {
                console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
                )
            } else {
                console.log(
                "Something went wrong when submitting your transaction:",
                err
                )
            }
        }
    )
}

mintNFT("https://gateway.pinata.cloud/ipfs/QmQFtdc7kq3QHCJ1XeTqDN3mAd9ru2UaE8vLTLFu9DF9KA")
