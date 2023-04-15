import { ethers } from "hardhat";

async function main() {
  const Confide = await ethers.getContractFactory("Confide");
  const confide = await Confide.deploy();

  await confide.deployed();

  console.log(
    `Confide deployed to ${confide.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
