export const dumbHash = <T>(data: T) => JSON.stringify(data);
export const hashCode = <T>(data: T) => dumbHash(data).split('').reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);