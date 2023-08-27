import { BeaconChainExecutionProduced } from './BeaconChainExecutionProduced';
import { getUrl } from '../utils/getUrl';
import { get } from '../utils/get';

export async function getProduced(
    authKey: string,
    validatorIndices: Array<number>
): Promise<Array<BeaconChainExecutionProduced>> {
    // TODO offset and limit?
    const url = getUrl(`/execution/${validatorIndices.join(',')}/produced?offset=0`);

    return await get<Array<BeaconChainExecutionProduced>>(authKey, url);
}
