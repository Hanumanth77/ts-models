export function clone<TSource>(clonedObject:TSource):TSource {
    return JSON.parse(JSON.stringify(clonedObject)) as TSource;
}
