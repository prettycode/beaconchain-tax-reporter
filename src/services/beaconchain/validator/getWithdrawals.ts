import { BeaconChainWithdrawal } from './BeaconChainWithdrawal';
import { isEpochFinalized } from '../epoch/isEpochFinalized';
import { fileCache } from '../../fileCache';
import { getUrl } from '../utils/getUrl';
import { get } from '../utils/get';

export async function getWithdrawals(
    authKey: string,
    validatorIndices: Array<number>,
    epoch: number
): Promise<Array<BeaconChainWithdrawal>> {
    // Gets last 100 epochs, starting at `epoch`
    const useCache = typeof epoch === 'number' && (await isEpochFinalized(authKey, epoch - 99));
    const url = getUrl(`/validator/${validatorIndices.join(',')}/withdrawals?epoch=${epoch}`);

    if (useCache) {
        const cachedResult = await fileCache.get<Array<BeaconChainWithdrawal>>(url);

        if (cachedResult) {
            return cachedResult;
        }
    }

    const results = await get<Array<BeaconChainWithdrawal>>(authKey, url);

    if (useCache) {
        fileCache.set<Array<BeaconChainWithdrawal>>(url, results);
    }

    return results;
}
