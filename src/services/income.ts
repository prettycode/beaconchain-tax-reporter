import { join } from '../utils/join';
import { getProduced } from './beaconchain/execution/getProduced';
import { getSlot } from './beaconchain/slot/getSlot';
import { getValidators } from './beaconchain/validator/getValidators';
import { getWithdrawals } from './beaconchain/validator/getWithdrawals';

export type ValidatorIncome = {
    type: 'execution' | 'withdrawal';
    validatorIndex: number;
    location: string;
    amountEth: number;
    timestamp: string;
    extended?: Record<string, unknown>;
    toString: () => string;
};

export const sortValidatorIncomeByTimestampDesc = (a: ValidatorIncome, b: ValidatorIncome): number =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

export async function getValidatorIndicesForEthAddress(authKey: string, ethAddres: string): Promise<Array<number>> {
    console.log(`\nLooking for validator(s) for ETH address ${ethAddres}...`);

    const validators = await getValidators(authKey, ethAddres);
    const validatorIndices = validators.map((validator) => validator.validatorindex);

    console.log(`• ${validatorIndices.join('\n• ')}`);

    return validatorIndices;
}

export async function getValidatorWithdrawals(
    authKey: string,
    startingEpoch: number,
    validatorIndices: Array<number>,
    endEpoch: number
): Promise<Array<ValidatorIncome>> {
    const EPOCHS_PER_API_REQUEST = 100;
    const withdrawalHistory: Array<ValidatorIncome> = [];

    console.log(
        `\nLooking for withdrawal payouts for validator(s) ${validatorIndices.join(
            ', '
        )} between epochs ${startingEpoch} and ${endEpoch} (inclusive)...`
    );

    for (let currentEpoch = startingEpoch; currentEpoch <= endEpoch + EPOCHS_PER_API_REQUEST; currentEpoch += EPOCHS_PER_API_REQUEST) {
        const withdrawals = await getWithdrawals(authKey, validatorIndices, currentEpoch);

        for (const withdrawal of withdrawals) {
            const withdrawalSlot = await getSlot(authKey, withdrawal.slot);

            if (!withdrawalSlot) {
                throw new Error(`Slot ${withdrawal.slot} does not exist.`);
            }

            const withdrawalIncome: ValidatorIncome = {
                type: 'withdrawal',
                validatorIndex: withdrawal.validatorindex,
                location: join([
                    `Withdrawal ${withdrawal.withdrawalindex}`,
                    `epoch ${withdrawal.epoch}`,
                    `slot ${withdrawal.slot}`,
                    `block ${withdrawalSlot.exec_block_number}`
                ]),
                amountEth: withdrawal.amount / 1000000000,
                timestamp: new Date(withdrawalSlot.exec_timestamp * 1000).toISOString(),
                extended: {
                    address: withdrawal.address,
                    blockRoot: withdrawal.blockroot,
                    epoch: withdrawal.epoch,
                    slot: withdrawal.slot,
                    withdrawalIndex: withdrawal.withdrawalindex,
                    raw: withdrawal,
                    toString: function (): string {
                        return JSON.stringify(this, null, '    ');
                    }
                }
            };

            withdrawalHistory.push(withdrawalIncome);

            console.log(
                `• ${withdrawalIncome.amountEth} ETH withdrawal payout for ${withdrawalIncome.validatorIndex} ` +
                    `in epoch ${withdrawalIncome.extended?.epoch} ${withdrawalIncome.timestamp}`
            );
        }
    }

    return withdrawalHistory;
}

export async function getValidatorExecutions(authKey: string, validatorIndices: Array<number>): Promise<Array<ValidatorIncome>> {
    console.log(`\nLooking for block production payouts for validator(s) ${join(validatorIndices)}...`);

    const executions = await getProduced(authKey, validatorIndices);
    const executionsByTimestampAsc = executions.sort((a, b) => a.timestamp - b.timestamp);
    const executionHistory: Array<ValidatorIncome> = executionsByTimestampAsc.map((execution) => {
        return {
            type: 'execution',
            validatorIndex: execution.posConsensus.proposerIndex,
            location: `Block ${execution.blockNumber}`,
            amountEth: execution.producerReward / 1000 / 1000000000000000,
            timestamp: new Date(execution.timestamp * 1000).toISOString(),
            extended: {
                blockNumber: execution.blockNumber,
                blockMevReward: execution.blockMevReward / 1000 / 1000000000000000,
                blockReward: execution.blockReward / 1000 / 1000000000000000,
                producerReward: execution.producerReward / 1000 / 1000000000000000,
                feeRecipient: execution.feeRecipient,
                producerFeeRecipient: execution.relay?.producerFeeRecipient,
                raw: execution,
                toString: function (): string {
                    return JSON.stringify(this, null, '    ');
                }
            }
        };
    });

    executionHistory.forEach((execution) =>
        console.log(
            `• ${execution.amountEth} ETH producer payout for ${execution.validatorIndex} ` +
                `for block ${execution.extended?.blockNumber} ${execution.timestamp}`
        )
    );

    return executionHistory;
}
