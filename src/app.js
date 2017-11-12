var _ = require("lodash");
var request = require("request-promise");
var fs = require('fs');
// Web3 Js
var Tx = require('ethereumjs-tx');
var Web3 = require('Web3');
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
} else {
    // eth network to send on (currently ropsten testnet)
    web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ZiPr5aAvDUswywSYvRaK'))
};
// keys
const keys = require('./keys.js');
const privateKey = new Buffer(keys.privateKey, 'hex');
// create transaction parameters
const rawTx = {
    // nonce = transaction id (compare to SQL auto_increment id)
    nonce: web3.eth.getTransactionCount('0x4B830B03753c636A45c489a78Fa853e9EF659ECD'),
    // where the funds will go (currently a test address)
    to: '0xb6b0Eb43445Fbf7dB95b25940de6Fa2dAf4D8d90',
    // value of tx
    value: web3.toHex(1),
    // gas price
    gasPrice: web3.toHex(20000000000),
    // gas limit
    gasLimit: web3.toHex(100000),
    // optional data - later will be used for function call from contract to transfer DIVX
    data: '0xc0de'
}
// define the tx with rawTx object
const tx = new Tx(rawTx);
// sign the tx with funding account private key
tx.sign(privateKey);
// serialize tx (built in web3 function)
const serializedTx = tx.serialize();
// send the transaction, concatenate 0x, check for errors, get the tx hash
web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    if (!err) {
        console.log('TX Hash: ' + hash)
    } else {
        console.log(err);
    }
});
// Find balance of funding account (testnet account for now)
var balance = web3.eth.getBalance('0x4B830B03753c636A45c489a78Fa853e9EF659ECD');
console.log(balance);

// Airdrop
const contractAddress = '0x13f11c9905a08ca76e3e853be63d4f0944326c72';
const etherscanApiUrl = 'https://api.etherscan.io/api'
const ethereumDivider = 1000000000000000000;
const thisAirdropTotal = 1000; // amount of tokens allocated for airdrop distribution
const intervalTime = 1; // milliseconds to test
let targetTime = 10080; // minutes per week

// // randomly generate airdrop time
// const airDropCall = () => {
//     const randomTime = _.round(Math.random() * targetTime + 1);
//     targetTime--;
//     if (randomTime === 1) {
//         getEtherPrice(thisAirdropTotal);
//         clearInterval(refreshInterval);
//     }
// };
// // function to stop and refresh interval
// const refreshInterval = setInterval(airDropCall, intervalTime);


// const getEtherPrice = function (airDropTotal) {
//   // api call for finding contract transactions (contributions)
//   const normalTransactions = {
//     uri: etherscanApiUrl,
//     qs: {
//       apikey: keys,
//       module: 'account',
//       action: 'txlist',
//       startblock: 0,
//       endblock: 999999999,
//       sort: 'asc',
//       address: contractAddress
//     },
//     headers: {
//       'User-Agent': 'Request-Promise'
//     }
//   }

//   Promise.all(
//       [
//        request(normalTransactions)
//       ]
//   )
//   .then( res => {
//       const normalTransactions = JSON.parse(res[0]).result;
//       // find bonus based on blocktime
//       const bonusFind = (blockNum) => {
//         if (blockNum < 4438800) {
//             return 100;
//         } else if (blockNum < 4496400 ) {
//             return 30;
//         } else if (blockNum < 4554000) {
//             return 15;
//         } else if (blockNum < 4611600) {
//             return 0;
//         }
//       }
//       // filter transaction array to find incoming transactions only
//       const inTransactions = _.filter(normalTransactions, {'to': contractAddress});
//       // loop through transactions to find bonus multiplier based on contribution amount
//       let txArr = _.map(inTransactions, function(inTransaction) {
//         const bonusMultiplier = bonusFind(inTransaction.blockNumber) / 100 + 1;
//         const purchased = bonusMultiplier * inTransaction.value / ethereumDivider * 500;
//             return {
//                 from: inTransaction.from,
//                 purchased
//             };
//       });
//       // filter only qualified transactions (over 1000 DIVX)
//       const totalQualified = _.filter(txArr, function(inTransaction) {
//           return inTransaction.purchased >= 1000;
//       });
//       // add together total supply of qualified transactions
//       const sumQualified = _.sumBy(totalQualified, 'purchased');
//       // figure out how much each address receives
//       txArr = totalQualified.map(filtInTx => {
//         filtInTx['airDrop'] = (airDropTotal * filtInTx.purchased) / sumQualified;
//         return filtInTx;
//       })
//       console.log(txArr);
//     }
//   )
//   .catch(err => {console.log(`error:${err}`)})
// }


