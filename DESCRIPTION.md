# Description of POPG Token & VestingWallet Contracts

## Overview

The POPG Token and VestingWallet contracts are designed to work together to manage the distribution and utilization of POPG tokens. The contracts provide a robust mechanism for token management and vesting, ensuring that tokens are allocated according to predefined schedules and milestones.

## POPG Token Contract

### Purpose

The `POPGToken` contract implements the ERC-20 standard with additional features to enhance its functionality and usability. It is primarily used to manage the POPG token, which is an essential component of our ecosystem.

### Key Features

- **ERC-20 Compliance**: Adheres to the ERC-20 token standard for compatibility with various platforms and services.
- **Permit Functionality**: Supports off-chain signature-based approvals, allowing for more flexible token transfers and interactions.
- **Burnable**: Allows token holders to burn their tokens, which reduces the total supply and can help in managing inflation or token economics.

### Usage

- **Token Transfer**: Users can transfer tokens to other addresses, following standard ERC-20 functionality.
- **Burn Tokens**: Token holders can reduce their token balance by calling the `burn` function.
- **Permit Approvals**: Utilize the permit function for off-chain approvals.

## VestingWallet Contract

### Purpose

The `VestingWallet` contract manages the vesting schedule for the POPG tokens. It ensures that tokens are distributed to beneficiaries over time based on predefined milestones and schedules.

### Key Features

- **Milestone-Based Vesting**: Distributes tokens at specific milestones, which can be set according to project requirements or strategic goals.
- **Beneficiary Management**: Allows for the configuration of multiple beneficiaries, with customizable allocation percentages.
- **Admin Control**: Provides administrative control over vesting schedules, beneficiary addresses, and token releases.

### Usage

- **Release Tokens**: The contract automatically releases tokens to beneficiaries when a milestone is reached.
- **Change Beneficiary**: The owner can update beneficiary addresses if necessary.
- **View Vesting Details**: The contract includes functions to view the current vesting status, including available amounts and vesting periods.

## Integration

The `POPGToken` and `VestingWallet` contracts are designed to work together seamlessly. Typically, the `VestingWallet` contract will hold the tokens and manage their distribution, while the `POPGToken` contract handles the core token functionalities.

## Summary

Together, these contracts provide a comprehensive solution for managing and distributing POPG tokens. They offer flexibility in terms of token handling, vesting schedules, and beneficiary management, making them suitable for a wide range of use cases within the ecosystem.

For further details, please refer to the [README](README.md) file for installation, deployment, and usage instructions.
