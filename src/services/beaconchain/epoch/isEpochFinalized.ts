import { getEpoch } from './getEpoch';

let finalizedEpoch: number | undefined;

export async function isEpochFinalized(authKey: string, epoch: number): Promise<boolean> {
    if (finalizedEpoch === undefined) {
        finalizedEpoch = (await getEpoch(authKey, 'finalized')).epoch;
    }

    return epoch <= finalizedEpoch;
}
