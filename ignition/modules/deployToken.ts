import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import deployModule from "./deployVesting";

export const deployTokenModule = buildModule("DeployTokenModule", (m) => {
  const vesting = m.useModule(deployModule).vesting;
  const token = m.contract("POPGToken", [vesting]);

  return { token };
});

export default deployTokenModule;
