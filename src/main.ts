import {
    ValidatorIncome,
    getValidatorExecutions,
    getValidatorIndicesForEthAddress,
    getValidatorWithdrawals,
    sortValidatorIncomeByTimestampDesc
} from './services/income';
import { getEpoch } from './services/beaconchain/epoch/getEpoch';
import { writeIncomeReports } from './writeIncomeReports';
import { parse } from 'ts-command-line-args';
import dotenv from 'dotenv';

type CommandLineArgs = {
    withdrawalsStartEpoch?: number;
    ignoreRecordsBeforeInclusive?: string;
};

export type AppConfig = {
    beaconchainApiKey: string;
    validatorEthAddress: string;
    withdrawalsStartEpoch: number;
    ignoreRecordsBeforeInclusive: number;
};

function getCommandLineArgs(): CommandLineArgs {
    return parse<CommandLineArgs>({
        withdrawalsStartEpoch: {
            type: Number,
            optional: true
        },
        ignoreRecordsBeforeInclusive: {
            type: String,
            optional: true
        }
    });
}

function getAppConfig(): AppConfig {
    dotenv.config();

    const beaconchainApiKey = process.env.BEACONCHAIN_APIKEY;

    if (!beaconchainApiKey) {
        throw new Error('Missing `BEACONCHAIN_APIKEY` environmental variable.');
    }

    const validatorEthAddress = process.env.VALIDATOR_ETHADDRESS;

    if (!validatorEthAddress) {
        throw new Error('Missing `VALIDATOR_ETHADDRESS` environmental variable.');
    }

    const args = getCommandLineArgs();

    let withdrawalsStartEpoch = Number(args.withdrawalsStartEpoch);

    if (isNaN(withdrawalsStartEpoch) || withdrawalsStartEpoch === 0) {
        // The first epoch that withdrawals were enabled in
        withdrawalsStartEpoch = 194516;
    }

    const ignoreRecordsBeforeInclusive = new Date(args.ignoreRecordsBeforeInclusive || 0).getTime();

    return {
        beaconchainApiKey,
        validatorEthAddress,
        withdrawalsStartEpoch,
        ignoreRecordsBeforeInclusive
    };
}

export async function main(): Promise<void> {
    const appConfig = getAppConfig();

    console.log('Configuration =', appConfig);

    const { beaconchainApiKey, validatorEthAddress, withdrawalsStartEpoch, ignoreRecordsBeforeInclusive } = appConfig;

    const filterByStartDateExclsuive = (incomeRecord: ValidatorIncome): boolean =>
        new Date(incomeRecord.timestamp).getTime() > ignoreRecordsBeforeInclusive;
    const latestFinalizedEpoch = (await getEpoch(beaconchainApiKey, 'finalized')).epoch;
    const validatorIndices = await getValidatorIndicesForEthAddress(beaconchainApiKey, validatorEthAddress);
    const withdrawals = (
        await getValidatorWithdrawals(beaconchainApiKey, withdrawalsStartEpoch, validatorIndices, latestFinalizedEpoch)
    ).filter(filterByStartDateExclsuive);
    const executions = (await getValidatorExecutions(beaconchainApiKey, validatorIndices)).filter(
        filterByStartDateExclsuive
    );
    const withdrawalsAndExecutions = [...withdrawals, ...executions];

    withdrawals.sort(sortValidatorIncomeByTimestampDesc);
    executions.sort(sortValidatorIncomeByTimestampDesc);
    withdrawalsAndExecutions.sort(sortValidatorIncomeByTimestampDesc);

    await writeIncomeReports(appConfig, validatorIndices, withdrawals, executions, withdrawalsAndExecutions);
}
