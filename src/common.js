/**
 * A bit like Object.assign(), but just a shallow copy
 * @param {any} target
 * @param {any} source
 * @return {any}
 */
export function shallowCopy(target, source) {
  Object.keys(source).forEach((k) => target[k] = source[k]);
  return target;
}
