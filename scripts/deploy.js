const { ethers } = require('hardhat');

async function main() {
  try {
    console.log('\n🚀 Initializing CryptEd contract deployment...\n');

    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();
    console.log('👤 Deployer address:', await deployer.getAddress());

    // Check deployer balance
    const initialBalance = await ethers.provider.getBalance(deployer.address);
    console.log('💰 Initial balance:', ethers.formatEther(initialBalance), 'ETH');
    if (initialBalance.toString() === '0') {
      throw new Error('Deployer account has insufficient funds');
    }

    // Get network information
    const network = await ethers.provider.getNetwork();
    console.log('🌐 Deploying to network:', network.name);
    console.log('⛓️  Chain ID:', network.chainId);

    // Get the contract factory
    console.log('\n📄 Retrieving contract factory...');
    const GoalZilla = await ethers.getContractFactory("GoalZilla");
    console.log('✅ Contract factory retrieved successfully\n');

    // Deploy the contract
    console.log('📦 Deploying contract...');
    const cryptEd = await CryptEd.deploy();
    console.log('\n⏳ Waiting for deployment confirmation...');
    await cryptEd.waitForDeployment();

    const contractAddress = await cryptEd.getAddress();
    console.log('\n✨ Contract deployed successfully!');
    console.log('📍 Contract Address:', contractAddress);

    // Verify contract deployment
    const code = await ethers.provider.getCode(contractAddress);
    if (code === '0x') {
      throw new Error('Contract deployment verification failed - no bytecode at address');
    }

    // Deployment summary
    const finalBalance = await ethers.provider.getBalance(deployer.address);
    console.log('\n📊 Deployment Summary:');
    console.log('💰 Final balance:', ethers.formatEther(finalBalance), 'ETH');

    return {
      contractAddress,
      finalBalance: ethers.formatEther(finalBalance),
    };

  } catch (error) {
    console.error('\n❌ Deployment failed!');
    console.error('🚨 Error:', error.message);

    // Enhanced error reporting
    if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Network connection failed. Please check your network configuration.');
    }
    if (error.code === 'CONTRACT_CALL_EXCEPTION') {
      console.error('📄 Contract deployment failed. Please check your contract code.');
    }

    throw error;
  }
}

// Execute deployment
main()
  .then((deploymentInfo) => {
    console.log('\n✅ Deployment script executed successfully!');
    console.log('📋 Deployment information:', deploymentInfo);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
