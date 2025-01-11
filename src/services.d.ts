interface MemoryStoreSortedMap extends Instance {
	UpdateAsync(key: string, transformFunction: (value: unknown, sortKey?: string | number) => unknown, expiration: number): LuaTuple<[unknown, unknown]>;
}