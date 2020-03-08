---
layout: post
title:  "Welcome to Jekyll!"
date:   2020-03-08 01:26:13 +0530
categories: jekyll update
permalink: Yahi-to-CHAHIYE-tha
---
Y
Jekyll also offers powerful support for code snippets:

```csharp
fhoshgidhgpd
l;vfjdbng
```

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/

# Create & Test Your  First Ethereum Smart Contract In Simplest Way Possible

![Ethereum-Banner](assets/ats/ats/Ethereum-Banner.jpg)

Let's create & test your first smart contract on Ethereum Blockchain with simplest approach possible today, we will be using [Ganache](http://truffleframework.com/ganache/), [Remix IDE](https://remix.ethereum.org/) & [MyEtherWallet](https://www.myetherwallet.com/).
We will be using use local instance of ethereum as a private blockchain for th sake of simplicity. Before that a let's have a quick look at Smart Contracts. 

## What is Smart Contract ?

![SmartContract_NickSzabo](assets/ats/ats/SmartContract_NickSzabo.jpeg)

Above image tells pretty much about Smart Contracts and it's origin. [Nick Szabo](https://en.wikipedia.org/wiki/Nick_Szabo), who is cryptography genius & legal scholar, has coined the term [Smart Contract](https://en.wikipedia.org/wiki/Smart_contract) back in 1994. He was trying to store and execute legal contracts with the help of cryptography. Since then there has been many implementation of Smart Contract, but nothing was widely accepted and popular like Ethereum Smart Contract.

## Tools Used

Let's understand what above mentioned tools does exactly, and how to use them.

### Ganache

Download and install Ganache from [http://truffleframework.com/ganache/](http://truffleframework.com/ganache/)

![Ganache_WebPage](assets/ats/ats/Ganache_WebPage.png)

Ganache runs a local instance of Ethereum, so we don't need to struggle with Geth command line, along with this we get few accounts created by default, which can be used in development and testing. 
Ganache has built-in block explorer also, so we can easily track all the block and transaction.

Apart from this Ganache has many other useful features which you can see below, according to their website.

![Ganache_Features](assets/ats/ats/Ganache_Features.png)

After installing, open Ganache you would see this window

![Ganache_Window](assets/ats/ats/Ganache_Window.png)

You can see here list of accounts along with their address, balance and other information. In header you can see blocks, transaction information etc. Observe  RPC SERVER Address here, with this address you would be interacting with this blockchain.

### Remix IDE

Remix is an online IDE for solidity language, you can access it online at [https://remix.ethereum.org/](https://remix.ethereum.org/). We will use it to write and compile our smart contract code.

![RemixIDE](assets/ats/ats/RemixIDE.PNG)

### MyEtherWallet

MyEtherWallet is an online wallet & client side interface, which can interact with Ethereum blockchain & perform operations on blockchain.

![MyEtherWallet_OnLine](assets/ats/ats/MyEtherWallet_OnLine.png)

But here we are using private blockchain running in our local, which can't be accessed by online version, so we will download it from [https://github.com/kvhnuke/etherwallet/releases](https://github.com/kvhnuke/etherwallet/releases) and run it locally.

![Download_MyEtherWallet](assets/ats/ats/Download_MyEtherWallet.png)

You can download latest release, unzip it and open index.html.

![MyEtherWallet_Local](assets/ats/ats/MyEtherWallet_Local.png)

## Write Smart Contract in Solidity

A New Language!😱, No, don't get scared, it's very similar to the code you write in your day to day life, which a few keywords here & there. Here I am not using any complex code but you can always go and check [http://solidity.readthedocs.io](http://solidity.readthedocs.io) for complete reference.

Solidity is a high level, contract oriented language which runs on Ethereum Virtual Machine(EVM). Let's understand the code, We are going to create a Calculator here, which is capable of performing Add & Subtract operation.

First line in any solidity program, tells the compiler the version of language it is targeting. In second line, as you know this is a contract oriented language, `contract` keyword is used to define a contract. You may relate it with class in OOPS to understand. 

Contracts will contain fields & function along with access modifier applied to them like any other language. In this code I have used `int` in all the place but Solidity do have rich type system which has many contract specific types as well like address & balance etc.

```js
pragma solidity ^0.4.24;
contract Calculator {
    int private lastValue = 0;
    function Add(int a, int b) public returns (int) {
        lastValue = a + b;
        return lastValue;
    }
    function Subtract(int a, int b) public returns (int) {
        lastValue = a - b;
        return lastValue;
    }
    function LastOperation() public constant returns (int) {
        return lastValue;
    }
}
```

In above code you can see, there is one field `lastValue`, which stores the last operation performed. Three functions Add, Subtract & LastOperation, here LastOperation has constant keyword, but other 2 do not. because LastOperation doesn't change the state whether Add & Subtract are mutating it.

Open [Remix IDE](https://remix.ethereum.org/) and replace exiting code with the above one. Then click `Start to compile` if it compiles successfully, you can see your contract name(Calculator here) in green box, below Details button. On click of details button you can see all the data about compiled contract, including generated byte code, which we will be using further.

![Compiled](assets/ats/ats/Compiled.png)

Your code is compiled successfully, now let's deploy & test it.

## Deploy Smart Contract to Private Ethereum Blockcahin & Test It

We will deploy it to blockchain running in Ganache with the help of MyEtherWallet. Open Ganache and grab `RPC SERVER` URL. 

![Ganache_RPC](assets/ats/ats/Ganache_RPC.png)

Now open index.html of MyEhterWallet, and connect to this blockchain. To do this click on dropdown as shown in image and select **Add Custom Network/Node**

![MEW_LocalNode](assets/ats/ats/MEW_LocalNode.png)

Give some name to Node and enter URL & Post copied from Ganache, and hit `Save & Use Cutom Node`.

![Add_Node](assets/ats/ats/Add_Node.png)

You will see success message in bottom.

![Node_Connected.png](assets/ats/ats/Node_Connected.png)

Now goto Contacts in menu and click **Deploy Contract**, here you need **Byte Code** of your smart contract to deploy, which we will get from details of contract in Remix IDE.

![Deploy_Contract](assets/ats/ats/Deploy_Contract.png)

Go back to Remix IDE, click on Details & copy BYTECODE.

![Copy_ByteCode](assets/ats/ats/Copy_ByteCode.png)

We need to pick contents of `object`, copy it & paste in **Byte Code** in Deploy Contract in MyEtherWallet.

```json
{
	"linkReferences": {},
	"object": "60806040526000805534801561001457600080fd5b5061017e806100246000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633e21f3961461005c578063830fb67c146100a7578063d3507d71146100f2575b600080fd5b34801561006857600080fd5b50610091600480360381019080803590602001909291908035906020019092919050505061011d565b6040518082815260200191505060405180910390f35b3480156100b357600080fd5b506100dc6004803603810190808035906020019092919080359060200190929190505050610133565b6040518082815260200191505060405180910390f35b3480156100fe57600080fd5b50610107610149565b6040518082815260200191505060405180910390f35b6000818303600081905550600054905092915050565b6000818301600081905550600054905092915050565b600080549050905600a165627a7a72305820ffa43bcf8db91f746657d0616346eaf4dcffe1e83be6d2ee91f6390f141bf47d0029",
	"opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x0 DUP1 SSTORE CALLVALUE DUP1 ISZERO PUSH2 0x14 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x17E DUP1 PUSH2 0x24 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x57 JUMPI PUSH1 0x0 CALLDATALOAD PUSH29 0x100000000000000000000000000000000000000000000000000000000 SWAP1 DIV PUSH4 0xFFFFFFFF AND DUP1 PUSH4 0x3E21F396 EQ PUSH2 0x5C JUMPI DUP1 PUSH4 0x830FB67C EQ PUSH2 0xA7 JUMPI DUP1 PUSH4 0xD3507D71 EQ PUSH2 0xF2 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x68 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x91 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x11D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xB3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xDC PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x133 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xFE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x107 PUSH2 0x149 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x0 DUP2 DUP4 SUB PUSH1 0x0 DUP2 SWAP1 SSTORE POP PUSH1 0x0 SLOAD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 ADD PUSH1 0x0 DUP2 SWAP1 SSTORE POP PUSH1 0x0 SLOAD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 POP SWAP1 JUMP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 SELFDESTRUCT LOG4 EXTCODESIZE 0xcf DUP14 0xb9 0x1f PUSH21 0x6657D0616346EAF4DCFFE1E83BE6D2EE91F6390F14 SHL DELEGATECALL PUSH30 0x2900000000000000000000000000000000000000000000000000000000 ",
	"sourceMap": "26:391:0:-;;;77:1;53:25;;26:391;8:9:-1;5:2;;;30:1;27;20:12;5:2;26:391:0;;;;;;;"
}
```

Right after pasting Byte Code, Gas Limit should appear. To access your wallet, MyEtherWallet need private key. Wallet 🤔? Yes, lemme explain wallet you in next step.

![Deploying](assets/ats/ats/Deploying.png)

As explained earlier Ganache will have few accounts created by default, Place where information about account is stored is referred as wallet. We will use one of those account.

![Show_Keys](assets/ats/ats/Show_Keys.png)
Open Ganache and copy key from one of the wallet and use this in above step, and click **Unblock**.
![Copy_Key](assets/ats/ats/Copy_Key.png)

After adding byte code and giving wallet access, hit Sign Transaction button, this makes transaction verifiable. Now Deploy Contract button will appear, hit it & confirm transaction to deploy your smart contract to blockchain.

![Sign_Transaction](assets/ats/ats/Sign_Transaction.png)

Let's verify in Ganache whether it's deployed successfully. Goto Transactions in Ganache, you can here one `Contract Creation` transaction created in a block. Congrats! your smart contract is deployed successfully.

![Contract_Created_Ganache](assets/ats/ats/Contract_Created_Ganache.png)

Let's test it now, click to open above shown transaction & copy **CREATED CONTRACT ADDRESS**. Goto MyEtherWallet & under Contracts, click Interact with Contract, paste the Contract Address here. 

![Interact_To_Contract](assets/ats/ats/Interact_To_Contract.png)

For ABI interface you need to go to Remix IDE then details, get ABI form here and paste. ABI interface contains information about functions available in smart contract.

![Copy_ABI](assets/ats/ats/Copy_ABI.png)

```json
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "a",
				"type": "int256"
			},
			{
				"name": "b",
				"type": "int256"
			}
		],
		"name": "Subtract",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "a",
				"type": "int256"
			},
			{
				"name": "b",
				"type": "int256"
			}
		],
		"name": "Add",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "LastOperation",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
```

After clicking Access, you can see all available functions in your smart contract.

![Access_Contract](assets/ats/ats/Access_Contract.png)

Let's call them & test.

![Call_Add](assets/ats/ats/Call_Add.png)

While calling Add or Subtract, it will show a warning before making transaction, along with gas limit.

![Add_Warning](assets/ats/ats/Add_Warning.png)

But in LastOperation no warning will appear. Because it adds no data to blockchain.

![LastOperation](assets/ats/ats/LastOperation.png) 

All those transactions you can see in Ganache, along with gas used.

![Transactions](assets/ats/ats/Transactions.png)

> Hope it helps 😀

