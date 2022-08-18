import { json } from "stream/consumers";

class Refund {
  async startRefund(): Promise<void> {
    const readline = require('readline');
    const fs = require('fs')
    const { ethers, VoidSigner } = require('ethers')
    require("dotenv").config()
    const { PRIVATE_KEY, ALCHEMY_KEY_MAINNET, ALCHEMY_KEY_RINKEBY, SEQUENCE_WALLET, SERVER_PRIVATE_KEY, URL_RPC_RELAYER } = process.env
    const RpcRelayer = require('@0xsequence/relayer')
    const Wallet = require('@0xsequence/wallet')
    const encodeNonce = require('@0xsequence/transactions')

    const myArgs = process.argv.slice(2);
    if (myArgs.length == 1) {
      type Transaction = {
        txnHash: string;
        amount: number;
        payment: number;
      }
      type Wallet = {
        totalMinted: number;
        totalPayement: number;
        totalToRefund: number;
        txs: Transaction[];
        refunded: string;
      }
      type JsonFile = {
        smartContract: string;
        network: string;
        finalPrice: number;
        createdAt: number;
        lastBlock: number;
        totalMinted: number;
        totalPayement: number;
        totalWallet: number;
        totalWalletToRefund: number;
        totalPayementToRefund: number;
        totalWalletRefund: number;
        totalRefund: number;
        totalRefundFees: number;
        wallets: Wallet[]
      }

      type Txs = {
        to: string;
        value: string;
      }

      let jsonFile: JsonFile = require(myArgs[0])

      if (jsonFile.totalWalletRefund == null) {
        jsonFile.totalWalletRefund = 0
      }
      if (jsonFile.totalRefund == null) {
        jsonFile.totalRefund = 0
      }
      if (jsonFile.totalRefundFees == null) {
        jsonFile.totalRefundFees = 0
      }

      const network: string = jsonFile.network

      let txs: Txs[] = []
      let wallets: string[] = []
      let countTxs: number = 0
      
      let provider;
      if (network == "mainnet") {
          provider = new ethers.providers.WebSocketProvider(`wss://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY_MAINNET}`)
      }
      else {
          provider = new ethers.providers.WebSocketProvider(`wss://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY_RINKEBY}`)
      }

      let gasPrice: string = String(await provider.getGasPrice())
      const maxGasFee: number = 30000000000
      const nbWallets: number = jsonFile.totalWalletToRefund - jsonFile.totalWalletRefund
      const amountToRefund: number = jsonFile.totalPayementToRefund - jsonFile.totalRefund
      const totalGasFee: number = parseInt(gasPrice) * nbWallets
      const nbTxsPerBatch: number = Math.floor(maxGasFee / parseInt(gasPrice))

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      rl.question(`You have ${nbWallets} wallets left to refund, for ${amountToRefund/10^16} ETH and ${totalGasFee} gas fees. Continue? [y/n]`, (answer: string) => {
        switch(answer.toLowerCase()) {
          case 'y':
          case 'Y':
            console.log('Ok we\'ll proced')
            break;
          default:
            process.exit(0)
        }
        rl.close()
      })

      const walletEOA = new ethers.Wallet(SERVER_PRIVATE_KEY, provider)
      const relayer = new RpcRelayer({url: URL_RPC_RELAYER})
      const wallet = (await Wallet.singleOwner(walletEOA)).connect(provider, relayer)

      const signer = wallet.getSigner()

      try {
        for (const walletAddress in jsonFile.wallets) {
          if (jsonFile.wallets.hasOwnProperty(walletAddress)) {
            if (jsonFile.wallets[walletAddress].refunded !== null) {
              console.log(jsonFile.wallets[walletAddress].refunded);
            }
            else {
              txs.push({
                to: walletAddress,
                value: String(jsonFile.wallets[walletAddress].totalToRefund)
              })
              wallets.push(walletAddress)
              //jsonFile.wallets[walletAddress].refunded = jsonFile.wallets[walletAddress].totalToRefund
              jsonFile.totalWalletRefund++
              jsonFile.totalRefund += jsonFile.wallets[walletAddress].totalToRefund
            }
            countTxs++
            if (countTxs === nbTxsPerBatch) {
              const txnResponse = await signer.sendTransaction(txs, undefined, undefined)

              const txnReceipt = await txnResponse.wait()

              fs.mkdirSync('./build', { recursive: true })
              fs.writeFileSync(`./build/transaction_refund_log.json`, JSON.stringify(txnReceipt))

              for (const walletAddress in jsonFile.wallets) {
                if (jsonFile.wallets.hasOwnProperty(walletAddress) && walletAddress in wallets) {
                  jsonFile.wallets[walletAddress].refunded = txnReceipt.txnHash
                }
              }
              fs.writeFileSync(myArgs[0], JSON.stringify(jsonFile))

              txs = []
              wallets = []
            }
          }
        }

        fs.writeFileSync(myArgs[0], JSON.stringify(jsonFile))

        process.exit(0)
      }
      catch(error) {
        console.log(error);
      }
    }
    else {
        console.log("Param is missing, please give the json file to parse.");
    }
  }
}

const refund = new Refund();
refund.startRefund();

//script param : the json file to parse
//npx ts-node .\scripts\refund.ts .\build\refund_round_1_output.json
