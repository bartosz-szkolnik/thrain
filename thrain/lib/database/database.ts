import { readTextFile, writeTextFile } from '../common/utils.ts';
// import { QueryBuilder } from './query-builder.ts';
import { SelectQuery, evaluateCondition, selectFields } from './query.ts';
// import { BaseTable } from './types.ts';

export class Database<Entry extends { id: string }> {
  constructor(private path: string, private key: string) {}

  async query(query: SelectQuery<Extract<keyof Entry, string>>): Promise<Partial<Entry>[]> {
    const file = await readTextFile(this.path);
    const db = JSON.parse(file);
    const entries = db[this.key] as Entry[];

    let results = entries;

    // Apply WHERE clause if it exists
    if (query.where) {
      results = entries.filter(item => evaluateCondition(item, query.where!));
    }

    // Select specific fields or all fields
    return results.map(item => selectFields(item, query.fields));
  }

  async insert(value: Omit<Entry, 'id'>) {
    const entries = await this.load();

    // We are using autoincrement. If we were to use something like uuid v4, this wouldn't be necessary
    const [last] = entries.toSorted((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1));

    // todo: why is this assertion necessary?
    const entry: Entry = Object.assign({}, value, { id: String(Number(last.id) + 1) }) as Entry;

    entries.push(entry);
    await this.sync(entries);

    return entry;
  }

  async update(id: string, value: Partial<Omit<Entry, 'id'>>) {
    const entries = await this.load();

    const entry = entries.find(entry => entry.id === id);
    const index = entries.findIndex(entry => entry.id === id);
    if (!entry) {
      throw new Error(`Could not find an entry with id ${id}.`);
    }

    const updated = { ...entry, ...value } satisfies Entry;
    await this.sync([...entries.slice(0, index), updated, ...entries.slice(index + 1)]);

    return updated;
  }

  async delete(id: string) {
    const entries = await this.load();

    const initialLength = entries.length;
    const updatedEntries = entries.filter(entry => entry.id !== id);

    if (updatedEntries.length === initialLength) {
      return false;
    }

    await this.sync(updatedEntries);
    return true;
  }

  private async load() {
    const file = await readTextFile(this.path);
    const db = JSON.parse(file);
    return [...db[this.key]] as Entry[];
  }

  private async sync(updatedEntries: Entry[]) {
    const json = JSON.stringify({ [this.key]: updatedEntries }, null, 2);
    await writeTextFile(this.path, json);
  }

  // useBuilder() {
  //   return new QueryBuilder<>(this);
  // }
}
