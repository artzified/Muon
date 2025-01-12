import { MemoryStoreService } from "@rbxts/services";
import { BaseOptions, SortedMapOptions } from "..";
import { exponentialBackoff } from "../util/expBackoff";

export class SortedMap {
	private sortedMap: MemoryStoreSortedMap;

	constructor(
		name: string,
		private options: SortedMapOptions,
	) {
		this.sortedMap = MemoryStoreService.GetSortedMap(name);
	}

	async get<T>(
		key: string, 
		overrideOptions?: BaseOptions
	): Promise<LuaTuple<[value: T, sortKey: string | number]>> {
		const options = {
			...this.options,
			...overrideOptions
		};

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () => 
			this.sortedMap.GetAsync(key) as LuaTuple<[T, string | number]>
		);
	}

	async getRange<T>(
		direction: Enum.SortDirection,
		count: number,
		exclusiveLowerBound: {key: string, sortKey: string | number},
		exclusiveUpperBound: {key: string, sortKey: string | number},
		overrideOptions?: BaseOptions
	): Promise<{key: string, value: T, sortKey?: string | number}[]> {
		const options = {
			...this.options,
			...overrideOptions
		};

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.sortedMap.GetRangeAsync(direction, count, exclusiveLowerBound, exclusiveUpperBound) as {key: string, value: T, sortKey?: string | number}[]
		);
	}

	async set<T>(
		key: string,
		value: T,
		sortKey?: string | number,
		overrideOptions?: BaseOptions
	): Promise<boolean> {
		const options = {
			...this.options,
			...overrideOptions
		};

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.sortedMap.SetAsync(key, value, options.lifetime, sortKey)
		);
	}

	async update<T>(
		key: string,
		transformFunction: (value: unknown, sortKey?: string | number) => T & any,
		overrideOptions?: BaseOptions
	): Promise<[lastValue?: T & any, lastSortKey?: string | number]> {
		const options = {
			...this.options,
			...overrideOptions
		};

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.sortedMap.UpdateAsync(key, transformFunction, options.lifetime),
		);
	}
}