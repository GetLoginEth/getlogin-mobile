# GetLogin Mobile

**GetLogin Mobile** is a single sign-on solution for decentralized applications.

With it, you can authorize third-party mobile applications to work on your behalf with the safe allocation of cryptocurrency for these actions.

Gnosis Chain is used as the blockchain. The application has built-in support for the BZZ token from Swarm. With this combination, developers can create applications that use not only decentralized finance, but also storage.

BZZ tokens are used to pay for storage. With the help of them you can pay for the download and upload of data. Despite the fact that at the moment the node and gateways do not support the mechanism of direct payment for data operations, such a mechanism is under consideration by the application developers.

With this combination of technologies, applications can be built that can act as a secure cloud for your data. You can store any kind of files: music, video, photo. You can securely share files with other users, store application settings, and so on.

# Screens

<img src="https://github.com/GetLoginEth/getlogin-mobile/raw/main/demo/screen1.jpg" width="300">

# Features

* Built with Expo in Typescript as cross-platform application (iOS and Android)
* Creation of a secure account in the form of a mnemonic and a record of a username in the blockchain
* Receive and transfer xDai and BZZ on Gnosis Chain
* Receive and transfer finances using wallet address or a username
* Scanning a QR code with a wallet address to transfer funds (and files in the future)
* Deeplink authorization for 3rd party applications
* Creating and sharing application session with 3rd party DApps

# Application sessions

**Application session** is an Ethereum-based wallet that is funded with a safe amount of funds. The address is registered in the smart contract as an address operating on behalf of the user. Such an address can be checked for validity in smart contracts created on Solidity.

An example of such a smart contract can be seen in the [demo project](https://github.com/GetLoginEth/login-example/blob/master/contract/main.sol).

# DApp registration

* Create GetLogin account on [https://getlogin.org](https://getlogin.org)
* Open [https://getlogin.org/developers](https://getlogin.org/developers)
* Create new DApp
* Under "Allowed URLs" enter your DApp supported system + DApp scheme
```
ios:glnotes://
android:com.shadurin.getloginmobile
```
Where `glnotes://` is the protocol you have registered for your iOS application.

`com.shadurin.getloginmobile` is the package name of your Android application.

* Save DApp information

# DApps Authorization

To authorize your DApp with GetLogin, open url from your DApp
```
getlogin://dapp-authorize?applicationId=YOU_DAPP_ID
```

Where `YOU_DAPP_ID` is the ID received when registering your DApp.

Example of the DApp implemented with Expo for iOS and Android https://github.com/GetLoginEth/login-example-expo

# Deploy

`npm ci`

`eas build`

`eas submit --platform android`

`eas submit --platform ios`
