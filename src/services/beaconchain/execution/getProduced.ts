import axios from "axios";
import { BeaconChainExecutionProduced } from "./BeaconChainExecutionProduced";
import { throttle } from "../utils/throttle";
import { getUrl } from "../utils/getUrl";
import { getHeaders } from "../utils/getHeaders";

export async function getProduced(authKey: string, validatorIndices: Array<number>): Promise<Array<BeaconChainExecutionProduced>> {
    // TODO offset and limit?
    const url = getUrl(`/execution/${validatorIndices.join(',')}/produced?offset=0`);

    const headers = getHeaders(authKey);
    const promise = axios.get(url, { headers });
    const throttled = await throttle(promise);
    const results = throttled.data.data;
  
    return results;
}