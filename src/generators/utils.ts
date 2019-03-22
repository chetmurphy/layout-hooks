import { ParamValue } from '../components/Params'

/**
 * Load param by key from localStorage
 * @param prefix
 * @param key
 */
export function loadFromLocalStorage(prefix: string, key: string) {
  const v: string | null = localStorage.getItem(prefix + '.' + key)
  if (v) {
    return JSON.parse(v)
  }
  return undefined
}

/**
 * Store params by key to localStorage
 * @param prefix
 * @param key
 * @param value
 */
export function saveToLocalStorage(
  prefix: string,
  key: string,
  value: ParamValue
) {
  localStorage.setItem(prefix + '.' + key, JSON.stringify(value))
}
