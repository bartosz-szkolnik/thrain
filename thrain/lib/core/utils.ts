export function zip<T>(...arrays: T[][]) {
  const maxLength = Math.max(...arrays.map(a => a.length));
  return Array(maxLength)
    .fill(null)
    .map((_, i) => arrays.map(a => a[i]));
}

export async function wait(seconds: number) {
  return await new Promise(resolve => setTimeout(() => resolve(null), seconds * 1000));
}

export async function executeAfter(miliseconds: number, fn: () => void) {
  return await new Promise(resolve => {
    setTimeout(() => {
      fn();
      resolve(null);
    }, miliseconds);
  });
}
