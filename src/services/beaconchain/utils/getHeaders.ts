export function getHeaders(authKey: string) {
    if (!authKey) {
        throw new Error(`\`authKey\` not provided.`);
    }

    return {
        Authorization: authKey,
        'Content-Type': 'application/json'
    };
}