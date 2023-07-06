export function getHeaders(authKey: string): Record<string, string> {
    if (!authKey) {
        throw new Error('`authKey` not provided.');
    }

    return {
        Authorization: authKey,
        'Content-Type': 'application/json'
    };
}