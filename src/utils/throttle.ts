import { sleep } from "./sleep";

export async function throttle<T>(promise: Promise<T>) {
    await sleep(throttle.seconds);
    return promise;
}

throttle.setSeconds = (seconds: number) => throttle.seconds = seconds;
throttle.seconds = 6;