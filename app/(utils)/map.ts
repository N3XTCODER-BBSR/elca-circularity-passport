/**
 * Create a map from a list of items
 * @param list
 * @param keyGetter
 * @returns map
 */
export const createMap = <T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T> => {
  const map = new Map<K, T>()
  list.forEach((item) => {
    map.set(keyGetter(item), item)
  })
  return map
}

/**
 * merges several maps into one that have same key and value types
 * @param maps maps to merge
 * @returns map with entries from all maps
 */
export const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  return new Map<K, V>(maps.map((map) => Array.from(map.entries())).flat())
}
