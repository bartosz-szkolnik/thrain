/**
 * A string variable representing the value of foo.
 */
let foo = 'Foo';

/**
 * Gets the current value of foo.
 * @returns {string} The current value of foo.
 */
function getFoo(): string {
  console.log('Invoked Get Foo');
  return foo;
}

/**
 * Sets a new value for foo.
 * @param {string} value - The new value to set for foo.
 * @returns {string} The updated value of foo.
 */
function setFoo(value: string): string {
  console.log(`Invoked Set Foo with ${value}`);
  foo = value;
  return foo;
}

export const fooProvider = { getFoo, setFoo };
