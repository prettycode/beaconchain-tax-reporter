import {
    getValidatorExecutions,
    getValidatorIndicesForEthAddress,
    getValidatorWithdrawals,
    sortValidatorIncomeByTimestampDesc
} from './services/income';
import { getEpoch } from './services/beaconchain/epoch/getEpoch';
import { writeIncomeReports } from './writeIncomeReports';
import dotenv from 'dotenv';

function getConfig(): { beaconchainApiKey: string, validatorEthAddress: string, startEpoch: number } {
    dotenv.config();

    const beaconchainApiKey = process.env.BEACONCHAIN_APIKEY;

    if (!beaconchainApiKey) {
        throw new Error('Missing `BEACONCHAIN_APIKEY` environmental variable.');
    }

    const validatorEthAddress = process.env.VALIDATOR_ETHADDRESS;

    if (!validatorEthAddress) {
        throw new Error('Missing `VALIDATOR_ETHADDRESS` environmental variable.');
    }

    let startEpoch = +process.argv[2];

    if (isNaN(startEpoch)) {
        // The first epoch that withdrawals were enabled in
        startEpoch = 194516;
    }

    return {
        beaconchainApiKey,
        validatorEthAddress,
        startEpoch
    };
}

export async function main(): Promise<void> {
    const {
        beaconchainApiKey,
        validatorEthAddress,
        startEpoch
    } = getConfig();

    const latestFinalizedEpoch = (await getEpoch(beaconchainApiKey, 'finalized')).epoch;
    const validatorIndices = await getValidatorIndicesForEthAddress(beaconchainApiKey, validatorEthAddress);
    const withdrawals = await getValidatorWithdrawals(beaconchainApiKey, startEpoch, validatorIndices, latestFinalizedEpoch);
    const executions = await getValidatorExecutions(beaconchainApiKey, validatorIndices);
    const withdrawalsAndExecutions = [...withdrawals, ...executions];

    withdrawals.sort(sortValidatorIncomeByTimestampDesc);
    executions.sort(sortValidatorIncomeByTimestampDesc);
    withdrawalsAndExecutions.sort(sortValidatorIncomeByTimestampDesc);

    const reportsPath = `.income-reports-${new Date().toISOString().substring(0, 10)}`;

    await writeIncomeReports(reportsPath, withdrawals, executions, withdrawalsAndExecutions);
}