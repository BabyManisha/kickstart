## WEB3 KICKSTART APP
A NextJs application using ethereum blockchain and web3 to manage Campaigns and Projects

1. Compile the project
    `node ethereum/compile.js`
2. Change HD_WALLET_URL in the .env file with MetaMask Rinkeby Test Network's New RPC URL
3. Deploy the project
   `node ethereum/deploy.js`
4. Save the Factory address from above output, and add that in the FACTORY_ADDRESS variable .env file
5. Test the project by running the testcases
   `npm test`
6. Start the web app
    `npm run dev`
7. Open browser with url `http://localhost:3000/`