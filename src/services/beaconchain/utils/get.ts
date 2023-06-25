import axios from "axios";
import { getHeaders } from "./getHeaders";
import { throttle } from "./throttle";

export async function get<TResult>(authKey: string, url: string): Promise<TResult> {
    const headers = getHeaders(authKey);
    const promise = axios.get(url, { headers });
    const throttled = await throttle<{ data: { data: TResult } }>(promise);
    
    return throttled.data.data;
}