import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // First deploy the ERC20 token
  const tokenDeploy = await deploy("MockERC20", {
    from: deployer,
    args: ["EduToken", "ELO", 18], // name, symbol, decimals
    log: true,
    autoMine: true,
  });

  // Deploy EduLingo with the token address
  console.log("Deploying EduLingo with token address:", tokenDeploy.address, " pls fund ser");
  await deploy("EduLingo", {
    from: deployer,
    args: [tokenDeploy.address], // Use the deployed token address instead of zero address
    log: true,
    autoMine: true,
  });

  // Get the deployed contracts to interact with them
  const tokenContract = await hre.ethers.getContract<Contract>("MockERC20", deployer);
  // const eduLingo = await hre.ethers.getContract<Contract>("EduLingo", deployer);

  // Mint tokens to owner (deployer) and hardcoded address
  const INITIAL_SUPPLY = hre.ethers.parseEther("1000000"); // 1 million tokens

  await tokenContract.mint(deployer, INITIAL_SUPPLY);

  console.log("✅ Tokens minted to deployer and hardcoded address");
  console.log("👋 EduLingo deployed with token:", tokenDeploy.address);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
