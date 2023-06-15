export const dumbHash = (data: any) => JSON.stringify(data);
export const hashCode = (data: any) => dumbHash(data).split('').reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);