import axios from "axios";
import { fileCache } from "../../fileCache";
import { BeaconChainValidator } from "./BeaconChainValidator";
import { throttle } from "../utils/throttle";
import { getUrl } from "../utils/getUrl";
import { getHeaders } from "../utils/getHeaders";

export async function getValidators(authKey: string, ethAddress: string): Promise<Array<BeaconChainValidator>> {
    // Note: never cache response, new validators could be added at any time
    const url = getUrl(`/validator/eth1/${ethAddress}`);    
    const headers = getHeaders(authKey);
    const promise = axios.get(url, { headers });
    const throttled = await throttle(promise);
    const results = throttled.data.data;
  
    return results;
}