import { ethers, network } from "hardhat";
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  developmentChains,
  proposalsFile,
} from "../helper-hardhat-config";
import * as fs from "fs";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function main(porposalIdex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][porposalIdex];
  // voting options: 0 = against, 1 = for, 2 = abstain
  const voteWay = 1;
  const reason = "I like that with all my strength";
  const governor = await ethers.getContract("GovernorContract");
  const voteTXresponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );

  await voteTXresponse.wait(1);
  let proposalState = await governor.state(proposalId);
  console.log(`Current state is ${proposalState}`);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  proposalState = await governor.state(proposalId);
  console.log(`Now state is ${proposalState}`);
  console.log("Voted! Let's move on! :-P :-D 8-}");
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
