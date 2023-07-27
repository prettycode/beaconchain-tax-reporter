export const convertToCsv = (array: Array<Record<string, string | number | boolean | undefined | object>>): string =>
    [
        Object.keys(array[0] || {}),
        ...array.map(
            (item) =>
                '"' +
                Object.values(item)
                    .map((item) => item?.toString().replace(/"/g, '\u0027'))
                    .join('","') +
                '"'
        )
    ].join('\n');
