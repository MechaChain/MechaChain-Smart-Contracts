class Refund {
  async startRefund(): Promise<void> {
    const readline = require('readline');
    const fs = require('fs')
    const { ethers } = require('ethers')
    require("dotenv").config()
    const { ALCHEMY_KEY_MAINNET, ALCHEMY_KEY_RINKEBY, SEQUENCE_WALLET, SERVER_PRIVATE_KEY, URL_RPC_RELAYER } = process.env
    const RpcRelayer = require('@0xsequence/relayer')
    const Wallet = require('@0xsequence/wallet')

    // get the script args to find the json file
    const myArgs = process.argv.slice(2);
    if (myArgs.length == 1) {
      //variabls init
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
      
      //get the right provider according to the ethereum network
      let provider;
      if (network == "mainnet") {
          provider = new ethers.providers.WebSocketProvider(`wss://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY_MAINNET}`)
      }
      else {
          provider = new ethers.providers.WebSocketProvider(`wss://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY_RINKEBY}`)
      }

      //get the actual gas fees
      let gasPrice: string = String(await provider.getGasPrice())
      const maxGasFee: number = 30000000000
      const nbWallets: number = jsonFile.totalWalletToRefund - jsonFile.totalWalletRefund
      const amountToRefund: number = jsonFile.totalPayementToRefund - jsonFile.totalRefund // FIXME: overflow
      const totalGasFee: number = parseInt(gasPrice) * nbWallets
      const nbTxsPerBatch: number = Math.floor(maxGasFee / parseInt(gasPrice))

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      //asking with a prompt if the user is agree to start the refund
      // FIXME: ${amountToRefund / 10 ^ 16} => overflow, use ethers.utils.formatEther(amountToRefund);
      rl.question(`You have ${nbWallets} wallets left to refund, for ${amountToRefund / 10 ^ 16} ETH and ${totalGasFee} gas fees. Continue? [y/n]`, (answer: string) => {
        switch (answer.toLowerCase()) {
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
        //loop on all the wallets
        for (const walletAddress in jsonFile.wallets) {
          if (jsonFile.wallets.hasOwnProperty(walletAddress)) {
            if (jsonFile.wallets[walletAddress].refunded !== null) {
              //if we already refund the wallet do we do something ?
              console.log(jsonFile.wallets[walletAddress].refunded);
            }
            else {
              //here we add the refund transaction in the batch array
              txs.push({
                to: walletAddress,
                value: String(jsonFile.wallets[walletAddress].totalToRefund)
              })
              wallets.push(walletAddress)
              //jsonFile.wallets[walletAddress].refunded = jsonFile.wallets[walletAddress].totalToRefund
              jsonFile.totalWalletRefund++
              jsonFile.totalRefund += jsonFile.wallets[walletAddress].totalToRefund // FIXME: overflow
            }
            countTxs++
            //if we have the max number of transactions we start a batch
            if (countTxs === nbTxsPerBatch) {
              const txnResponse = await signer.sendTransaction(txs, undefined, undefined)

              const txnReceipt = await txnResponse.wait()

              fs.mkdirSync('./build', { recursive: true })
              fs.writeFileSync(`./build/transaction_refund_log.json`, JSON.stringify(txnReceipt))

              //we update the given file with the new informations
              for (const walletAddress in jsonFile.wallets) {
                if (jsonFile.wallets.hasOwnProperty(walletAddress) && walletAddress in wallets) {
                  jsonFile.wallets[walletAddress].refunded = txnReceipt.txnHash
                }
              }
              fs.writeFileSync(myArgs[0], JSON.stringify(jsonFile))

              txs = []
              wallets = []
              // FIXME: Reset countTxs for the next batch ???
            }
          }
        }

        fs.writeFileSync(myArgs[0], JSON.stringify(jsonFile))
        // TODO: success message with path
        process.exit(0)
      }
      catch(error) {
        console.log(error);
      }
      // TODO: Print 'totalRefunded'
      // TODO: Print 'totalWalletRefund' 
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
