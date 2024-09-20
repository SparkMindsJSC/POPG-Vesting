import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Addressable, Signer } from "ethers";
import hre from "hardhat";
import { describe, it } from "mocha";
import address from "../data/addressList.json";
import { POPGToken, VestingWallet } from "../typechain-types";

describe("Test locking smart contract", function () {
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let tokenContract: POPGToken;
  let vestingWalletContract: VestingWallet;
  let vestingAddress: string | Addressable;

  this.beforeAll(async function () {
    [owner, user1, user2] = await hre.ethers.getSigners();
    const addressOwner = await owner.getAddress();
    // Deploy vesting wallet contract
    vestingWalletContract = await hre.ethers.deployContract("VestingWallet", [
      addressOwner,
    ]);

    await vestingWalletContract.waitForDeployment();
    vestingAddress = vestingWalletContract.target;

    //Deploy token contract
    tokenContract = await hre.ethers.deployContract("POPGToken", [
      vestingAddress,
    ]);
    await tokenContract.waitForDeployment();

    await vestingWalletContract
      .connect(owner)
      .changeAddressBenificiary(0, address.addressLocalNode[0]);
    await vestingWalletContract
      .connect(owner)
      .changeAddressBenificiary(1, address.addressLocalNode[1]);
    await vestingWalletContract
      .connect(owner)
      .changeAddressBenificiary(2, address.addressLocalNode[2]);
    await vestingWalletContract
      .connect(owner)
      .changeAddressBenificiary(3, address.addressLocalNode[3]);
  });

  it("Should have correct name and symbol", async function () {
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();

    expect(name).to.equal("POPG");
    expect(symbol).to.equal("POPG");
  });

  it("Deployment should assign the total supply of tokens to vesting wallet contract", async function () {
    const ownerBalance = await tokenContract.balanceOf(vestingAddress);
    expect(await tokenContract.totalSupply()).to.equal(ownerBalance);
  });

  // Lock release contract
  it("Should set milestone 1 correctly", async function () {
    const milestone1 = await vestingWalletContract.MILESTONE_1_DATE();
    expect(milestone1).equal(1714521600);
  });

  it("Should not time release", async function () {
    const now = Math.round(Date.now() / 1000);
    const currentPhase = await vestingWalletContract.getPhaseAtTime(now);
    expect(currentPhase).equal(0);
  });

  it("Should address of business must same with constructor", async function () {
    const businessAddress = await vestingWalletContract.businessMarketing();
    expect(businessAddress).equal(address.addressLocalNode[0]);
  });

  it("Should can get distribution data of beneficiary", async function () {
    const phase = 0;

    const [percentages, phases] =
      await vestingWalletContract.getDistributionData(0);

    const percentage = BigInt(percentages[phase]);
    expect(percentage).equal(35);
  });

  it("Should new address after change must equal with name variable", async function () {
    await vestingWalletContract
      .connect(owner)
      .changeAddressBenificiary(0, address.newAddressBeneficiary);
    const businessAddress = await vestingWalletContract.businessMarketing();

    expect(address.newAddressBeneficiary).equal(businessAddress);
  });

  it("Should available in vesting contract equal with total supply", async function () {
    const totalSupply = await tokenContract.totalSupply();

    const availableBalance = await vestingWalletContract.getAvailableAmount(
      tokenContract.target
    );

    expect(availableBalance).equal(totalSupply);
  });

  it("Should amount in first release must equal 20% of total supply", async function () {
    const availableAmountRelease =
      await vestingWalletContract.getAvailableAmount(tokenContract.target);
    const percentageRelease = (await vestingWalletContract.milestones(0))
      .percentage;

    const amount = (availableAmountRelease * percentageRelease) / BigInt(100);

    const timeReleasePhase1 = await vestingWalletContract.MILESTONE_1_DATE();
    await time.increaseTo(timeReleasePhase1);

    const amountFirstRelease = await vestingWalletContract
      .connect(owner)
      .releasable(tokenContract.target);

    expect(amountFirstRelease).equal(amount);
  });

  async function getPercentage(
    index_beneficiary: number,
    phase: number
  ): Promise<BigInt> {
    const [percentages, phases] =
      await vestingWalletContract.getDistributionData(index_beneficiary);

    return BigInt(percentages[phase]);
  }

  async function getAmountReceivedRelease(
    percentages: BigInt[],
    totalDistribute: BigInt
  ) {
    return percentages.map(
      (item) =>
        (BigInt(item.toString()) * BigInt(totalDistribute.toString())) /
        BigInt(100)
    );
  }

  it("Should amount business and preSale must equal with amount predefined", async function () {
    const phase = 0;

    const result0 = await vestingWalletContract.getBenificiary(0);
    console.log("result1: ", result0);

    const result1 = await vestingWalletContract.getBenificiary(1);
    console.log("result2: ", result1);

    const result2 = await vestingWalletContract.getBenificiary(2);
    console.log("result3: ", result2);

    const result3 = await vestingWalletContract.getBenificiary(3);
    console.log("result3: ", result3);

    const percentageUser1 = await getPercentage(0, phase);

    const percentageUser2 = await getPercentage(1, phase);

    const amountSecondRelease = await vestingWalletContract
      .connect(owner)
      .releasable(tokenContract.target);

    const [balanceUser1Received, balanceUser2Received] =
      await getAmountReceivedRelease(
        [percentageUser1, percentageUser2],
        amountSecondRelease
      );

    await vestingWalletContract.connect(owner).release(tokenContract.target);

    const balanceOfBusiness = await tokenContract.balanceOf(
      address.newAddressBeneficiary
    );

    const balanceOfPreSale = await tokenContract.balanceOf(
      address.addressLocalNode[1]
    );

    expect(BigInt(balanceUser1Received)).equal(balanceOfBusiness);
    expect(BigInt(balanceUser2Received)).equal(balanceOfPreSale);
  });

  it("Should rest amount will be auto unlock to balance of owner after final released", async function () {
    const timeReleasePhase4 = await vestingWalletContract.MILESTONE_4_DATE();
    await time.increaseTo(timeReleasePhase4);

    // Release at the time phase 4
    await vestingWalletContract
      .connect(owner)
      .release(tokenContract.getAddress());

    const availableBanaceVesting =
      await vestingWalletContract.getAvailableAmount(
        tokenContract.getAddress()
      );
    await vestingWalletContract
      .connect(owner)
      .unlockRestAmount(tokenContract.getAddress());

    const balanceOfOwner = await tokenContract.balanceOf(owner.getAddress());

    expect(balanceOfOwner).equal(availableBanaceVesting);
  });
});
