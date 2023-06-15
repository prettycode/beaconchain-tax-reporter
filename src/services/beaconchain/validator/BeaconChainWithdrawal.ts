export type BeaconChainWithdrawal = {
    epoch: number;
    slot: number;
    blockroot: string;
    withdrawalindex: number;
    validatorindex: number;
    address: string;
    amount: number;
};