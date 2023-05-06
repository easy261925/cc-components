export const delay = (data: any, second = 1) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise<any>(resolve => setTimeout(() => resolve(data), second * 1000))
}