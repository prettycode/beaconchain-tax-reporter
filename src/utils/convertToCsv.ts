export const convertToCsv = (array: Array<Record<string, any>>) => [Object.keys(array[0]), ...array.map(item => '"' + Object.values(item).map(item => item.toString().replace(/"/g, "'")).join('","') + '"')].join('\n');