export function getHeaders(authKey: string) {
    if (!authKey) {
        throw new Error(`\`authKey\` not provided: "${authKey}"`);
    }

    return {
        'Authorization': authKey,
        'Content-Type': 'application/json'
    };
}