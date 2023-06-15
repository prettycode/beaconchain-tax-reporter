import axios from "axios";
import { fileCache } from "../../fileCache";
import { BeaconChainValidator } from "./BeaconChainValidator";
import { throttle } from "../../../utils/throttle";
import { getUrl } from "../utils/getUrl";
import { getHeaders } from "../utils/getHeaders";

export async function getValidators(authKey: string, ethAddress: string): Promise<Array<BeaconChainValidator>> {
    const useCache = false; // Never cache validators, they could be added at any time
    const url = getUrl(`/validator/eth1/${ethAddress}`);    

    if (useCache) {
        const cachedResult = await fileCache.get<Array<BeaconChainValidator>>(url);
        
        if (cachedResult) {
            return cachedResult;
        }
    }

    const headers = getHeaders(authKey);
    const promise = axios.get(url, { headers });
    const throttled = await throttle(promise);
    const results = throttled.data.data;
  
    if (useCache) {
        fileCache.set<Array<BeaconChainValidator>>(url, results);
    }

    return results;
}
