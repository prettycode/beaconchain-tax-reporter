export type BeaconChainEpoch = {
    attestationscount: number;
    attesterslashingscount: number;
    averagevalidatorbalance: number;
    blockscount: number;
    depositscount: number;
    eligibleether: number;
    epoch: number;
    finalized: boolean;
    globalparticipationrate: number;
    missedblocks: number;
    orphanedblocks: number;
    proposedblocks: number;
    proposerslashingscount: number;
    rewards_exported: boolean;
    scheduledblocks: number;
    totalvalidatorbalance: number;
    ts: string;
    validatorscount: number;
    voluntaryexitscount: number;
    votedether: number;
    withdrawalcount: number;
};