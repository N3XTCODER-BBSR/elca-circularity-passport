/**
 * Create a map from a list of items
 * @param list
 * @param keyGetter
 * @returns
 */
export const createMap = <T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T> => {
  const map = new Map<K, T>()
  list.forEach((item) => {
    map.set(keyGetter(item), item)
  })
  return map
}
