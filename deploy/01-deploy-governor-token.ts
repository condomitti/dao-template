import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying Governance token...");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    // waitConfirmations:
  });

  console.log(`Deployed GovernanceToken to ${governanceToken.address}`);
  await delegate(governanceToken.address, deployer);
  console.log("Delegated!");
};

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccont: string
) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccont);
  tx.wait(1);
  console.log(
    `Checkpoint ${await governanceToken.numCheckpoints(delegatedAccont)}`
  );
};

export default deployGovernanceToken;
