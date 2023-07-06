import axios from 'axios';
import { throttle } from '../utils/throttle';
import { fileCache } from '../../fileCache';
import { getUrl } from '../utils/getUrl';
import { getHeaders } from '../utils/getHeaders';
import { BeaconChainSlot } from './BeaconChainSlot';

export async function getSlot(authKey: string, slotOrHash: number | string): Promise<BeaconChainSlot | null> {
    const url = getUrl(`/slot/${slotOrHash}`);
    const cachedResult = await fileCache.get<BeaconChainSlot>(url);

    if (cachedResult) {
        return cachedResult;
    }

    const headers = getHeaders(authKey);
    const promise = axios.get(url, { headers });
    const throttled = await throttle(promise);
    const results = throttled.data.data;

    // Slot exists and is finalized
    if (results !== null && results.status === '1') {
        fileCache.set<BeaconChainSlot>(url, results);
    }

    return results;
}