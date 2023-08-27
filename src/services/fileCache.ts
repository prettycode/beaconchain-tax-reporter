import { hashCode } from '../utils/hash';
import fs from 'fs';

const CACHE_PATH = './.cache';

const memoryCache: Record<string, string> = {};

const urlPathToSafeFilename = (urlPath: string): string => encodeURIComponent(urlPath);
const getFilenameSafeCacheKey = (urlPath: string): string =>
    `./${CACHE_PATH}/${urlPathToSafeFilename(urlPath)}.${hashCode(urlPath)}.json`;

if (!fs.existsSync(CACHE_PATH)) {
    fs.mkdirSync(CACHE_PATH);
}

export class fileCache {
    public static async get<TReturn>(url: string): Promise<TReturn | undefined> {
        const cacheKey = getFilenameSafeCacheKey(url);
        let cacheContents: string | undefined = memoryCache[cacheKey];

        if (!cacheContents) {
            const cacheEntryExists = fs.existsSync(cacheKey);

            if (!cacheEntryExists) {
                // console.info(`> Not cached: ${url}`);
                return undefined;
            }

            cacheContents = await fs.promises.readFile(cacheKey, 'utf-8');
            memoryCache[cacheKey] = cacheContents;
        }

        return JSON.parse(cacheContents) as TReturn;
    }

    public static async set<T>(url: string, value: T): Promise<void> {
        const cacheKey = getFilenameSafeCacheKey(url);
        const cacheContents = JSON.stringify(value, null, '    ');

        // console.info(`> Adding to cache: ${url}`, value);

        await fs.promises.writeFile(cacheKey, cacheContents, 'utf-8');
    }
}
