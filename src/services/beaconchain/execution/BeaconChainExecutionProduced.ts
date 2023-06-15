export type BeaconChainExecutionProduced = {
    blockHash: string;
    blockNumber: number;
    timestamp: number;
    blockReward: number;
    blockMevReward: number;
    producerReward: number;
    feeRecipient: string;
    gasLimit: number;
    gasUsed: number;
    baseFee: number;
    txCount: number;
    internalTxCount: number;
    uncleCount: number;
    parentHash: string;
    uncleHash: string;
    difficulty: number;
    posConsensus: {
        executionBlockNumber: number;
        proposerIndex: number;
        slot: number;
        epoch: number;
        finalized: boolean;
    };
    relay: {
        tag: string;
        builderPubkey: string;
        producerFeeRecipient: string;
    };
    consensusAlgorithm: string;
};