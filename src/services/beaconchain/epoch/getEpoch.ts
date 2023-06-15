import axios from "axios";
import { throttle } from "../../../utils/throttle";
import { fileCache } from "../../fileCache";
import { BeaconChainEpoch } from "./BeaconChainEpoch";
import { isEpochFinalized } from "./isEpochFinalized";
import { getUrl } from "../utils/getUrl";
import { getHeaders } from "../utils/getHeaders";

export async function getEpoch(authKey: string, epoch: 'latest' | 'finalized' | number): Promise<BeaconChainEpoch> {
    const useCache = typeof epoch === 'number' && await isEpochFinalized(authKey, epoch);
    const url = getUrl(`/epoch/${epoch}`);

    if (useCache) {
        const cachedResult = await fileCache.get<BeaconChainEpoch>(url);

        if (cachedResult) {
            return cachedResult;
        }
    }

    const headers = getHeaders(authKey);
    const promise = axios.get(url, { headers });
    const throttled = await throttle(promise);
    const results = throttled.data.data;

    if (useCache) {
        fileCache.set<BeaconChainEpoch>(url, results);
    }

    return results;
}