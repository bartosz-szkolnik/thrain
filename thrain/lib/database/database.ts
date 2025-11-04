import { readTextFile } from '../common/utils.ts';
// import { QueryBuilder } from './query-builder.ts';
import { SelectQuery, evaluateCondition, selectFields } from './query.ts';
// import { BaseTable } from './types.ts';

export class Database<Table extends Record<PropertyKey, unknown>> {
  constructor(private path: string, private key: string) {}

  async _query(query: SelectQuery<Extract<keyof Table, string>>): Promise<Partial<Table>[]> {
    const file = await readTextFile(this.path);
    const db = JSON.parse(file);
    const entries = db[this.key] as Table[];

    let results = entries;

    // Apply WHERE clause if it exists
    if (query.where) {
      results = entries.filter(item => evaluateCondition(item, query.where!));
    }

    // Select specific fields or all fields
    return results.map(item => selectFields(item, query.fields));
  }

  async query(query: SelectQuery<Extract<keyof Table, string>>): Promise<Partial<Table>[]> {
    const file = await readTextFile(this.path);
    const db = JSON.parse(file);
    const entries = db[this.key] as Table[];

    let results = entries;

    // Apply WHERE clause if it exists
    if (query.where) {
      results = entries.filter(item => evaluateCondition(item, query.where!));
    }

    // Select specific fields or all fields
    return results.map(item => selectFields(item, query.fields));
  }

  // useBuilder() {
  //   return new QueryBuilder<>(this);
  // }
}
