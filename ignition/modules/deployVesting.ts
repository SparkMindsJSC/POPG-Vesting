import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import param from "../../data/addressList.example.json";

export const deployModule = buildModule("DeployVestingModule", (m) => {
  const vesting = m.contract("VestingWallet", [param.defaultBeneficiary]);
  return { vesting };
});

export default deployModule;
