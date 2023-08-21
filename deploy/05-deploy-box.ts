import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBox = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying Box...");

  const box = await deploy("Box", {
    from: deployer,
    log: true,
    args: [],
  });

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);
  const transferOwnershipTx = await boxContract.transferOwnership(
    timeLock.address
  );
  await transferOwnershipTx.wait(1);
  console.log("DONE! :-)");
};

export default deployBox;
