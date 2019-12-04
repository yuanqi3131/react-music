
export function setLocaStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getLocaStorage(key: string) {
  return JSON.parse(localStorage.getItem(key) || '[]')
}
