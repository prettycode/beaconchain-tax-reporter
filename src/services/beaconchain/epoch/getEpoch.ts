import { fileCache } from '../../fileCache';
import { BeaconChainEpoch } from './BeaconChainEpoch';
import { isEpochFinalized } from './isEpochFinalized';
import { getUrl } from '../utils/getUrl';
import { get } from '../utils/get';

export async function getEpoch(authKey: string, epoch: 'latest' | 'finalized' | number): Promise<BeaconChainEpoch> {
    const useCache = typeof epoch === 'number' && await isEpochFinalized(authKey, epoch);
    const url = getUrl(`/epoch/${epoch}`);

    if (useCache) {
        const cachedResult = await fileCache.get<BeaconChainEpoch>(url);

        if (cachedResult) {
            return cachedResult;
        }
    }

    const results = await get<BeaconChainEpoch>(authKey, url);

    if (useCache) {
        fileCache.set<BeaconChainEpoch>(url, results);
    }

    return results;
}