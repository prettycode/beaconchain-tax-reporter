import { BeaconChainValidator } from './BeaconChainValidator';
import { getUrl } from '../utils/getUrl';
import { get } from '../utils/get';

export async function getValidators(authKey: string, ethAddress: string): Promise<Array<BeaconChainValidator>> {
    // Note: never cache response, new validators could be added at any time
    const url = getUrl(`/validator/eth1/${ethAddress}`);

    return await get<Array<BeaconChainValidator>>(authKey, url);
}
