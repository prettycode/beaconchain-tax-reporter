import { ValidatorIncome } from "./income";

export type CoinTrackingRecord = {
    type: 'Income';
    inAmount: number;
    inTicker: 'ETH';
    outAmount: '';
    outTicker: '';
    feeTicker: '';
    exchange: 'Ethereum Protocol';
    tradeGroup: '';
    comment: string;
    date: string;
}

function createCoinTrackingRecordFromValidatorIncome({amountEth, date, comment}: {amountEth: number, date: string, comment: string}): CoinTrackingRecord {
    return {
        type: 'Income',
        inAmount: amountEth,
        inTicker: 'ETH',
        outAmount: '',
        outTicker: '',
        feeTicker: '',
        exchange: 'Ethereum Protocol',
        tradeGroup: '',
        comment,
        date
    };
}

export function withdrawalIncomeToCoinTrackingRecord(withdrawal: ValidatorIncome): CoinTrackingRecord {
    return createCoinTrackingRecordFromValidatorIncome({
        amountEth: withdrawal.amountEth, 
        date: withdrawal.timestamp, 
        comment: `Validator ${withdrawal.validatorIndex}, withdrawal ${withdrawal.extended?.withdrawalIndex}, epoch ${withdrawal.extended?.epoch}`
    });
}

export function executionIncomeToCoinTrackingRecord(execution: ValidatorIncome): CoinTrackingRecord {
    return createCoinTrackingRecordFromValidatorIncome({
        amountEth: execution.amountEth, 
        date: execution.timestamp, 
        comment: `Validator ${execution.validatorIndex}, producer reward, block ${execution.extended?.blockNumber}`
    });
}
