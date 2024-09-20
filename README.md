# POPG Token & VestingWallet Contracts

## Introduction

This repository contains two Solidity smart contracts:

1. **POPGToken**: An ERC-20 token with permit functionality and burning capabilities.
2. **VestingWallet**: A vesting contract that distributes the POPG tokens over time to predefined beneficiaries based on set milestones.

Both contracts are designed to work together, with the `VestingWallet` managing the distribution of the `POPGToken` according to a vesting schedule.

## Table of Contents

- [POPG Token \& VestingWallet Contracts](#popg-token--vestingwallet-contracts)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Steps](#steps)
  - [Usage](#usage)
    - [Deploying the Contracts](#deploying-the-contracts)
    - [Contracts Overview](#contracts-overview)
      - [POPGToken](#popgtoken)
      - [VestingWallet](#vestingwallet)
    - [Milestones](#milestones)
    - [Beneficiary Structure](#beneficiary-structure)
    - [Functions](#functions)
      - [POPGToken Functions](#popgtoken-functions)
      - [VestingWallet Functions](#vestingwallet-functions)
  - [Configuration](#configuration)
  - [Dependencies](#dependencies)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [License](#license)
  - [Code of Conduct](#code-of-conduct)

## Features

- **ERC-20 Token with Permit**: The `POPGToken` contract supports ERC-20 token transfers, including the `permit` functionality for off-chain approvals.
- **Burnable Token**: Token holders can burn their tokens, reducing the total supply.
- **Milestone-Based Vesting**: The `VestingWallet` contract releases tokens to beneficiaries at predefined dates.
- **Configurable Beneficiaries**: The contract owner can change the addresses of the beneficiaries.
- **Admin Control**: The owner can control vesting schedules, beneficiaries, and unlock remaining tokens after all milestones are met.

## Installation

To deploy and interact with the `POPGToken` and `VestingWallet` contracts, ensure that you have the following prerequisites:

1. [Node.js](https://nodejs.org/)
2. [Hardhat](https://hardhat.org/)
3. [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/SparkMindsJSC/popg-vesting.git
   cd popg-vesting
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile the contracts:

   ```bash
   npx hardhat compile
   ```

4. Deploy the contracts:

   ```bash
      npx hardhat ignition deploy ./ignition/modules/deployToken.ts --network <network>
   ```

## Usage

### Deploying the Contracts

1. **POPGToken**:
   Deploy the `POPGToken` contract by passing the address of the `VestingWallet` to the constructor.

   Example:

   ```solidity
   const popgToken = await POPGToken.deploy(vestingWallet.address);
   ```

2. **VestingWallet**:
   Deploy the `VestingWallet` contract and use its address to initialize the `POPGToken` contract.

   Example:

   ```solidity
   const vestingWallet = await VestingWallet.deploy("0xInitialBeneficiaryAddress");
   ```

### Contracts Overview

#### POPGToken

The `POPGToken` contract is an ERC-20 token with the following key features:

- **Max Supply**: The maximum token supply is `10,000,000,000 POPG`.
- **Permit Functionality**: Supports off-chain signature-based approvals (`ERC20Permit`).
- **Burnable**: Token holders can burn their tokens using the `burn()` function.

#### VestingWallet

The `VestingWallet` contract manages the vesting of the `POPGToken` over four milestones, distributing the tokens to beneficiaries according to their allocated percentages.

### Milestones

| Milestone   | Date (Unix Timestamp) | Percentage |
| ----------- | --------------------- | ---------- |
| Milestone 1 | 1714521600            | 20%        |
| Milestone 2 | 1730419200            | 10%        |
| Milestone 3 | 1746057600            | 10%        |
| Milestone 4 | 1761955200            | 10%        |

### Beneficiary Structure

| Beneficiary        | Percentage Allocation |
| ------------------ | --------------------- |
| Business Marketing | 35%                   |
| Presale            | 30%                   |
| Reserve            | 25%                   |
| Advisor            | 10%                   |

### Functions

#### POPGToken Functions

- **`burn(uint256 amount)`**: Burns the specified amount of tokens from the caller’s balance.

  ```solidity
  function burn(uint256 amount) public;
  ```

- **`permit(...)`**: Allows for off-chain approvals via signature, as specified in the ERC-2612 `ERC20Permit` extension.

#### VestingWallet Functions

- **Release**: Releases tokens to beneficiaries when a milestone is reached.

  ```solidity
  function release(address token) external returns (bool);
  ```

- **Distribute**: Distributes tokens among beneficiaries according to the current phase.

  ```solidity
  function distributeRecipient(address token, uint256 amount) internal returns (bool);
  ```

- **Change Beneficiary Address**: Allows the owner to change the beneficiary address of a particular recipient.

  ```solidity
  function changeAddressBenificiary(uint8 _indexAddress, address _benificiary) external onlyOwner returns (bool);
  ```

- **View Functions**: These include viewing the available tokens, the start and end of the vesting, and the details of beneficiaries.

  ```solidity
  function getAvailableAmount(address token) public view returns (uint256);
  function start() public view virtual returns (uint256);
  function end() public view virtual returns (uint256);
  ```

## Configuration

- The `POPGToken` contract is initialized with the total supply minted to the `VestingWallet` address.
- The `VestingWallet` allows for configuring beneficiaries and setting vesting schedules according to specific phases.

## Dependencies

This project leverages the following dependencies:

- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
  - `ERC20.sol`
  - `ERC20Permit.sol`
  - `Ownable.sol`
  - `SafeERC20.sol`

Make sure to have these packages installed before deploying or interacting with the contracts.

## Troubleshooting

- **Issue**: Tokens are not released even after a milestone is reached.
  - **Solution**: Ensure the timestamp of the current block exceeds the milestone date and that the tokens are available in the contract.
- **Issue**: Unable to burn tokens.
  - **Solution**: Check if the caller has enough tokens in their balance to perform the burn operation.

## Contributing

We welcome contributions to improve this contract. If you’d like to contribute, please follow the steps below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

For more detailed guidelines, refer to our [CONTRIBUTING](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## Code of Conduct

We expect contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.
