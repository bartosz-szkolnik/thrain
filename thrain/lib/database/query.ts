export type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=';

export type SimpleCondition<Keys extends string = string> = {
  field: Keys;
  operator: Operator;
  value: string | number | boolean;
};

export type Condition<Keys extends string = string> = SimpleCondition<Keys> & { and?: Condition<Keys>[] } & {
  or?: Condition<Keys>[];
};

export type SelectQuery<Keys extends string = string> = {
  fields: Keys[] | '*';
  where?: Condition<Keys>;
};

function isSimpleCondition<K extends string>(c: Condition<K>): c is SimpleCondition<K> {
  return (c as SimpleCondition<K>).field !== undefined && (c as SimpleCondition<K>).operator !== undefined;
}

export function evaluateCondition<T extends Record<string, unknown>>(
  item: T,
  condition: Condition<Extract<keyof T, string>>,
): boolean {
  // compound AND and or
  if ('and' in condition && 'or' in condition) {
    // for now, will fix later
    throw new Error('Both AND and OR cinditions simaltenously not supported yet.');
  }

  // compound AND
  if ('and' in condition) {
    const { field, operator, value } = condition;
    const first = { field, operator, value } satisfies SimpleCondition;

    return (
      evaluateCondition(item, first) &&
      condition.and!.every(c => evaluateCondition(item, c as Condition<Extract<keyof T, string>>))
    );
  }

  // compound OR
  if ('or' in condition) {
    const { field, operator, value } = condition;
    const first = { field, operator, value } satisfies SimpleCondition;

    return (
      evaluateCondition(item, first) ||
      condition.or!.some(c => evaluateCondition(item, c as Condition<Extract<keyof T, string>>))
    );
  }

  // simple condition
  if (isSimpleCondition(condition)) {
    const { field, operator, value } = condition;
    const itemValue = item[field as keyof T];

    // type mismatch or missing field
    if (typeof itemValue !== typeof value) return false;

    switch (operator) {
      case '=':
        return itemValue === value;
      case '!=':
        return itemValue !== value;
      case '>':
        return typeof itemValue === 'number' && typeof value === 'number' ? (itemValue as number) > value : false;
      case '<':
        return typeof itemValue === 'number' && typeof value === 'number' ? (itemValue as number) < value : false;
      case '>=':
        return typeof itemValue === 'number' && typeof value === 'number' ? (itemValue as number) >= value : false;
      case '<=':
        return typeof itemValue === 'number' && typeof value === 'number' ? (itemValue as number) <= value : false;
      default:
        return false;
    }
  }

  return false;
}

export function selectFields<T extends Record<string, unknown>>(item: T, fields: (keyof T)[] | '*'): Partial<T> {
  if (fields === '*') {
    return { ...item } as Partial<T>;
  }

  const result: Partial<T> = {};
  for (const field of fields) {
    if (field in item) {
      result[field as keyof T] = item[field as keyof T];
    }
  }

  return result;
}
