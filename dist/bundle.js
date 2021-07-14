/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ (() => {

eval("const USDC_ADDRESS = \"0x2791bca1f2de4661ed88a30c99a7a9449aa84174\"\nconst WBTC_ADDRESS = \"0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6\"\nconst WETH_ADDRESS = \"0x7ceb23fd6bc0add59e62ac25578270cff1b9f619\"\nconst WMATIC_ADDRESS = \"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270\"\n\nconst QUICKSWAP_ROUTER = \"0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff\"\nconst SUSHISWAP_ROUTER = \"0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506\"\n\nconst MATIC_USD_ORACLE = \"0xAB594600376Ec9fD91F8e885dADF0CE036862dE0\"\nconst BTC_USD_ORACLE = \"0xc907E116054Ad103354f2D350FD2514433D57F6f\"\nconst ETH_USD_ORACLE = \"0xF9680D99D6C9589e2a93a78A04A279e509205945\"\n\nvar contract;\nvar user;\nvar total_in_usd;\n/*****************************************/\n/* Detect the MetaMask Ethereum provider */\n/*****************************************/\n\n// import detectEthereumProvider from '@metamask/detect-provider';\n\n// this returns the provider, or null if it wasn't detected\n// const provider = await detectEthereumProvider();\nconst provider = new ethers.providers.Web3Provider(window.ethereum)\nconst signer = provider.getSigner()\nconst confirmSwapButton = document.getElementById('confirmSwap');\nconst confirmApprovalButton = document.getElementById('confirmApprove')\n\nif (provider) {\n  startApp(provider); // Initialize your app\n} else {\n  console.log('Please install MetaMask!');\n}\n\nfunction startApp(provider) {\n  // If the provider returned by detectEthereumProvider is not the same as\n  // window.ethereum, something is overwriting it, perhaps another wallet.\n  if (provider !== window.ethereum) {\n    console.error('Do you have multiple wallets installed?');\n  }\n  //Basic Actions Section\n  // const onboardButton = document.getElementById('connectButton'); - come back to this later - for checking if metamask installed\n  const getAccountsButton = document.getElementById('getAccounts');\n  const getBalancesButton = document.getElementById('getBalances');\n  const getUSDBalancesButton = document.getElementById('getUSDBalances');\n  const rebalanceButton = document.getElementById('rebalance');\n\n  const getAccountsResult = document.getElementById('getAccountsResult');\n  // const getBalanceResult = document.getElementById('getBalanceResult');\n\n  // var balance;\n  var usdc_bal;\n  var wbtc_bal;\n  var weth_bal;\n  var wmatic_bal;\n\n  var _wmatic_in_usd;\n  var _wbtc_in_usd;\n  var _weth_in_usd;\n\n  var eth_usd_rate;\n  var wbtc_usd_rate;\n  var matic_usd_rate;\n  var usdc_usd_rate = 1;\n\n  var array_coins;\n  var inputs;\n\n\n  //Eth_Accounts-getAccountsButton\n  getAccountsButton.addEventListener('click', async () => {\n    //we use eth_accounts because it returns a list of addresses owned by us.\n    const accounts = await ethereum.request({ method: 'eth_accounts' });\n    user = accounts[0]; //should I declare this here or lower down as current account?\n    //We take the first address in the array of addresses and display it\n    getAccountsResult.innerHTML = user || 'Not able to get accounts';\n  });\n\n  getBalancesButton.addEventListener('click', async () => {\n    // balance = await provider.getBalance(user); //returns a BigNumber\n    // console.log(balance.toString());\n\n    wmatic_bal = await getBalance(WMATIC_ADDRESS);\n    getWMATICResult.innerHTML = wmatic_bal.toFixed(5) || 'Not able to get accounts'; //what if wmatic_bal undefined?\n\n    usdc_bal = await getBalance(USDC_ADDRESS);\n    getUSDCResult.innerHTML = usdc_bal.toFixed(5) || 'Not able to get accounts';\n\n    wbtc_bal = await getBalance(WBTC_ADDRESS);\n    getWBTCResult.innerHTML = wbtc_bal.toFixed(5) || 'Not able to get accounts';\n\n    weth_bal = await getBalance(WETH_ADDRESS);\n    getWETHResult.innerHTML = weth_bal.toFixed(5) || 'Not able to get accounts';\n  });\n\n  getUSDBalancesButton.addEventListener('click', async () => {\n    matic_usd_rate = await getExchangeRate(MATIC_USD_ORACLE) //assume for now matic = wmatic 1:1\n    _wmatic_in_usd = wmatic_bal * matic_usd_rate\n    WMATICInUsd.innerHTML = _wmatic_in_usd.toFixed(2) || 'Not able to get accounts';\n\n    wbtc_usd_rate = await getExchangeRate(BTC_USD_ORACLE)\n    _wbtc_in_usd = wbtc_bal * wbtc_usd_rate\n    WBTCInUsd.innerHTML = _wbtc_in_usd.toFixed(2) || 'Not able to get accounts'\n\n    eth_usd_rate = await getExchangeRate(ETH_USD_ORACLE)\n    _weth_in_usd = weth_bal * eth_usd_rate\n    WETHInUsd.innerHTML = _weth_in_usd.toFixed(2) || 'Not able to get accounts'\n\n    total_in_usd = _wmatic_in_usd + _wbtc_in_usd + _weth_in_usd + usdc_bal\n    TOTALInUsd.innerHTML = total_in_usd.toFixed(2) || 'Not able to get accounts'\n  })\n\n  rebalanceButton.addEventListener('click', async () => {\n    var no_of_assets = 4;\n    var target_per_asset = total_in_usd / no_of_assets;\n    // console.log(target_per_asset)\n\n    function Coin(symbol, address, decimals, balance, usd_balance, diff_from_average, usd_exchange_rate) { //in JS we create an object type by using a constructor function\n      this.symbol = symbol;\n      this.address = address;\n      this.decimals = decimals;\n      this.balance = balance;\n      this.usd_balance = usd_balance;\n      this.diff_from_average = diff_from_average;\n      this.usd_exchange_rate = usd_exchange_rate;\n    }\n    // calculate how far each coin is from the average USD value\n    var diff_wmatic = _wmatic_in_usd - target_per_asset\n    var diff_wbtc = _wbtc_in_usd - target_per_asset\n    var diff_weth = _weth_in_usd - target_per_asset\n    var diff_usdc = usdc_bal - target_per_asset\n\n    var usdc_decimals = await getDecimals(USDC_ADDRESS)\n    var wmatic_decimals = await getDecimals(WMATIC_ADDRESS)\n    var wbtc_decimals = await getDecimals(WBTC_ADDRESS)\n    var weth_decimals = await getDecimals(WETH_ADDRESS)\n\n    //create a coin object for each of our 4 assets - NOTE have to fix MATIC somehow...\n    var USDC = new Coin(\"USDC\", USDC_ADDRESS, usdc_decimals, usdc_bal, usdc_bal, diff_usdc, usdc_usd_rate);\n    var WMATIC = new Coin(\"WMATIC\", WMATIC_ADDRESS, wmatic_decimals, wmatic_bal, _wmatic_in_usd, diff_wmatic, matic_usd_rate); //this one will have to be different somehow\n    var WBTC = new Coin(\"WBTC\", WBTC_ADDRESS, wbtc_decimals, wbtc_bal, _wbtc_in_usd, diff_wbtc, wbtc_usd_rate);\n    var WETH = new Coin(\"WETH\", WETH_ADDRESS, weth_decimals, weth_bal, _weth_in_usd, diff_weth, eth_usd_rate);\n\n    //put our 4 coin objects into an array\n    array_coins = [USDC, WMATIC, WBTC, WETH];\n\n    //sort the coins by how far they are from the average\n    array_coins.sort((a, b) => {\n      return b.diff_from_average - a.diff_from_average;\n    });\n\n    // get the inputs for the swaps, perform the swaps, update the array each time\n\n    startSwap(array_coins);\n\n    // var tokenContract = new ethers.Contract(inputs[2][0], abi, signer);\n    // var filter = tokenContract.filters.Transfer(null, user);\n    // tokenContract.once(filter, async (owner, spender, value, event) => {\n    //   console.log('Swap 1 done');\n    //   startSwap(array_coins)\n    // })\n\n  })\n}\n\nasync function startSwap(array_coins) {\n  var inputs = getSwapInputs(array_coins); //balances 1 coin to the portfolio dollar average, and returns the remaining coins as an array\n  console.log(inputs);\n\n  //find out what router is approved to spend for this user (if anything)\n  var approvedAmount = await allowance(inputs[2][0], SUSHISWAP_ROUTER) //input token and router addresses\n  console.log(approvedAmount)\n\n  //if not, must approve it:\n  if (approvedAmount.lt(inputs[0])) { //less than\n    console.log('need to get approval');\n    //ask user to confirm asking for approval\n    if (window.confirm(\"Time to get approval!\")) {\n      //ask for approval\n      var approved = await giveApproval(inputs[2][0], SUSHISWAP_ROUTER, inputs[0]); //token_address, router_address, amountIn\n      //create a listener for the approval confirmation\n      var tokenContract = new ethers.Contract(inputs[2][0], abi, signer);\n      var filter = tokenContract.filters.Approval(user, null);\n      tokenContract.once(filter, async (owner, spender, value, event) => {\n        console.log('Tokens approved');\n        if (window.confirm(\"Time to do the swap!\")) {\n          //perform the swap\n          var swap_result = await swap(inputs[0], inputs[1], inputs[2], user, Date.now() + 1111111111111);\n          if (swap_result) { //I could modify this to listen for tx confirmation?\n            array_coins = updateArray(array_coins);\n          }\n        };\n      })\n    }\n  } else {\n    //if approval already exists, go straight to the swap\n    console.log('we got here!')\n    if (confirm(\"Time to do the swap!\")) {\n      //perform the swap\n      var swap_result = await swap(inputs[0], inputs[1], inputs[2], user, Date.now() + 1111111111111);\n      if (swap_result) { //I could modify this to listen for tx confirmation?\n        array_coins = updateArray(array_coins);\n      }\n    }\n  }\n}\n\n/**********************************************************/\n/* Handle chain (network) and chainChanged (per EIP-1193) */\n/**********************************************************/\n\n// const chainId = await ethereum.request({ method: 'eth_chainId' });\n// handleChainChanged(chainId);\n\n// ethereum.on('chainChanged', handleChainChanged);\n\n// function handleChainChanged(_chainId) {\n//   // We recommend reloading the page, unless you must do otherwise\n//   window.location.reload();\n// }\n\n/***********************************************************/\n/* Handle user accounts and accountsChanged (per EIP-1193) */\n/***********************************************************/\n\nlet currentAccount = null;\nethereum\n  .request({ method: 'eth_accounts' })\n  .then(handleAccountsChanged)\n  .catch((err) => {\n    // Some unexpected error.\n    // For backwards compatibility reasons, if no accounts are available,\n    // eth_accounts will return an empty array.\n    console.error(err);\n  });\n\n// Note that this event is emitted on page load.\n// If the array of accounts is non-empty, you're already\n// connected.\nethereum.on('accountsChanged', handleAccountsChanged);\n\n// For now, 'eth_accounts' will continue to always return an array\nfunction handleAccountsChanged(accounts) {\n  if (accounts.length === 0) {\n    // MetaMask is locked or the user has not connected any accounts\n    console.log('Please connect to MetaMask.');\n  } else if (accounts[0] !== currentAccount) {\n    currentAccount = accounts[0];\n    // console.log(currentAccount.balanceOf()) - I tried this here, didn't work - what CAN I do here?\n  }\n}\n\n/*********************************************/\n/* Access the user's accounts (per EIP-1102) */\n/*********************************************/\n\n// // You should only attempt to request the user's accounts in response to user\n// // interaction, such as a button click.\n// // Otherwise, you popup-spam the user like it's 1999.\n// // If you fail to retrieve the user's account(s), you should encourage the user\n// // to initiate the attempt.\ndocument.getElementById('connectButton', connect);\n\n// While you are awaiting the call to eth_requestAccounts, you should disable\n// any buttons the user can click to initiate the request.\n// MetaMask will reject any additional requests while the first is still\n// pending.\nfunction connect() {\n  ethereum\n    .request({ method: 'eth_requestAccounts' })\n    .then(handleAccountsChanged)\n    .catch((err) => {\n      if (err.code === 4001) {\n        // EIP-1193 userRejectedRequest error\n        // If this happens, the user rejected the connection request.\n        console.log('Please connect to MetaMask.');\n      } else {\n        console.error(err);\n      }\n    });\n}\n$(document).ready(function () { //when the document loads\n  window.ethereum.enable().then(function (accounts) { //this should cause a metamask popup\n    // instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]}); //creates an instance of the smart contract we want to interact with\n    // user = accounts[0];\n    // var accounts = web3.eth.getAccounts(); //this gets a list of the accounts in the Metamask wallet\n    // console.log(accounts)\n    // web3.eth.getBalance(user).then(console.log); //Get the balance of an address at a given block\n    // console.log(instance);\n\n  }) //call metamask enable function\n})\n\nasync function getBalance(token_address) {\n  // create a new instance of a contract - in web3.js >1.0.0, will have to use \"new web3.eth.Contract\" (uppercase C)\n  var tokenContract = new ethers.Contract(token_address, abi, signer)\n  // get the balance of our user in that token\n  try {\n    var tokenBalance = await tokenContract.balanceOf(user);\n    var decimals = await tokenContract.decimals();\n    tokenBalance = tokenBalance / (10 ** decimals)\n    return tokenBalance;\n  } catch (error) {\n    console.log(error)\n  }\n}\n\nasync function getExchangeRate(oracle_address) {\n  var oracle = new ethers.Contract(oracle_address, CHAINLINK_ORACLE_ABI, provider);\n  try {\n    var exchangeRate = await oracle.latestAnswer();\n    exchangeRate = exchangeRate.div(10 ** 8);\n    return exchangeRate;\n  } catch (error) {\n    console.log(error);\n  }\n}\n\nasync function getDecimals(token_address) {\n  var tokenContract = new ethers.Contract(token_address, abi, provider)\n  // check how many decimals that token has\n  try {\n    var decimals = await tokenContract.decimals();//need to catch an error here - perhaps make this it's own function!\n    return decimals;\n  } catch (error) {\n    console.log(error);\n  }\n}\n\nasync function allowance(token_address, router_address) {\n  // create a new instance of a contract\n  var tokenContract = new ethers.Contract(token_address, abi, signer)\n  // check what amount of user's tokens the spender is approved to use\n  try {\n    var approvedAmount = await tokenContract.allowance(user, router_address); //allowance(owner_address, spender_address)\n    return approvedAmount;\n  } catch (error) {\n    console.log(error)\n  }\n}\n\nasync function giveApproval(token_address, router_address, amountIn) {\n  // create a new instance of a contract\n  var tokenContract = new ethers.Contract(token_address, abi, signer)\n  // give router_address approval to spend user's tokens\n  try {\n    var approved = await tokenContract.approve(router_address, amountIn); //approve(spender, amount)\n    return approved;\n\n  } catch (error) {\n    console.log(error)\n  }\n}\n\n// async function approvalConfirmed() {\n//   var approvalconfirmed = await tokenContract.once(\"Approval\", (owner, spender, value, event) => {\n//     console.log('Tokens approved');\n//   }\n\nfunction getSwapInputs(array_coins) {\n  if (array_coins[0].diff_from_average > Math.abs(array_coins[array_coins.length - 1].diff_from_average)) { //check which coin is further from the dollar average\n\n    var swap_path = [array_coins[0].address, array_coins[array_coins.length - 1].address] //swap from first array item to last\n\n    var amountIn = Math.abs(array_coins[array_coins.length - 1].diff_from_average) * (1 / (array_coins[0].usd_exchange_rate)) //figure out how much to swap\n    var amountOutMin = Math.abs(array_coins[array_coins.length - 1].diff_from_average) * (1 / (array_coins[array_coins.length - 1].usd_exchange_rate)) * 0.75;\n\n    var amountIn_Wei = parseInt(amountIn * 10 ** array_coins[0].decimals).toString() //am I introducing potential rounding errors here? And should I check for NaN after?\n    var amountOutMin_Wei = parseInt(amountOutMin * 10 ** array_coins[array_coins.length - 1].decimals).toString()\n\n    console.log(`Swapping ${amountIn.toFixed(8)} of ${array_coins[0].symbol} for ${array_coins[array_coins.length - 1].symbol}`);\n    $(\"#swapStarted\").css(\"display\", \"block\");\n    $(\"#swapStarted\").text(`Swapping ${amountIn.toFixed(8)} of ${array_coins[0].symbol} for ${array_coins[array_coins.length - 1].symbol}`);\n\n    return [amountIn_Wei, amountOutMin_Wei, swap_path];\n  }\n  else {\n\n    var swap_path = [array_coins[0].address, array_coins[array_coins.length - 1].address]; // swap from last array item to first\n\n    var amountIn = Math.abs(array_coins[0].diff_from_average) * (1 / (array_coins[0].usd_exchange_rate)); //figure out how much to swap\n    var amountOutMin = Math.abs(array_coins[0].diff_from_average) * (1 / (array_coins[array_coins.length - 1].usd_exchange_rate)) * 0.75;\n\n    var amountIn_Wei = parseInt(amountIn * 10 ** array_coins[0].decimals).toString() //am I introducing potential rounding errors here? And should I check for NaN after?\n    var amountOutMin_Wei = parseInt(amountOutMin * 10 ** array_coins[array_coins.length - 1].decimals).toString()\n\n    console.log(`Swapping ${amountIn.toFixed(8)} of ${array_coins[0].symbol} for ${array_coins[array_coins.length - 1].symbol}`);\n    $(\"#swapStarted\").css(\"display\", \"block\");\n    $(\"#swapStarted\").text(`Swapping ${amountIn.toFixed(8)} of ${array_coins[0].symbol} for ${array_coins[array_coins.length - 1].symbol}`);\n\n    return [amountIn_Wei, amountOutMin_Wei, swap_path];\n  }\n}\n\nasync function swap(_amountIn, _amountOutMin, _path, _acct, _deadline) {\n  //making a swap on QUICKSWAP - first create an instance of the Quickswap router\n  var router = new ethers.Contract(SUSHISWAP_ROUTER, ROUTER_ABI, signer)\n  //perform the swap\n  try {\n    var swap = await router.swapExactTokensForTokens(_amountIn,\n      _amountOutMin,\n      _path,\n      _acct,\n      _deadline)\n    return true;\n  } catch (error) {\n    console.log(error); //can I get it to try again here??\n    return false;\n  }\n}\n\nfunction updateArray(array_coins) {\n  if (array_coins[0].diff_from_average > Math.abs(array_coins[array_coins.length - 1].diff_from_average)) { //check which coin is further from the dollar average\n    array_coins[0].diff_from_average -= Math.abs(array_coins[array_coins.length - 1].diff_from_average);\n    //remove the coin that's now balanced\n    array_coins.pop() //remove the last element from the array\n    //re-sort the array\n    array_coins.sort((a, b) => {\n      return b.diff_from_average - a.diff_from_average;\n    })\n    return array_coins;\n  }\n  else {\n    //decrease the diff_from_average of the coin we've just moved money out of\n    array_coins[array_coins.length - 1].diff_from_average += Math.abs(array_coins[0].diff_from_average);\n    //remove the coin that's now balanced\n    array_coins.shift(); //remove the last element from the array\n    //re-sort the array\n    array_coins.sort((a, b) => {\n      return b.diff_from_average - a.diff_from_average;\n    })\n    return array_coins;\n  }\n}\n\n\n//# sourceURL=webpack://pet-shop/./src/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/app.js"]();
/******/ 	
/******/ })()
;