import { sleep } from "../../../utils/sleep";

export async function throttle<T>(promise: Promise<T>) {
    // With free tier, API requests limited to 10/minute
    await sleep(6);
    return promise;
}