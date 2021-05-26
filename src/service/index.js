export function transformObjectToArray(obj) {
  return Object
    .keys(obj)
    .map(id => {return {id, ...obj[id]}})
    .reverse()
}