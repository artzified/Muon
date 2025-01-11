import { MemoryStoreService } from "@rbxts/services";
import { BaseOptions, HashMapOptions } from "..";
import { exponentialBackoff } from "../util/expBackoff";

export class HashMap {
	private hashMap: MemoryStoreHashMap;

	constructor(
		name: string,
		private options: HashMapOptions,
	) {
		this.hashMap = MemoryStoreService.GetHashMap(name);
	}

	async set<T>(
		key: string, 
		value: T, 
		overrideOptions?: BaseOptions
	): Promise<boolean> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.hashMap.SetAsync(key, value, options.lifetime),
		);
	}

	update<T>(
		key: string,
		updateFunction: (oldValue: T) => T & any,
		overrideOptions?: BaseOptions,
	): Promise<T & any> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.hashMap.UpdateAsync(key, updateFunction, options.lifetime),
		);
	}

	async get<T>(
		key: string, 
		overrideOptions?: BaseOptions
	): Promise<T> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(
			options.exponentialBackoff.base,
			options.exponentialBackoff.maxTries,
			() => this.hashMap.GetAsync(key) as T,
		);
	}

	async listItemsAsPages(
		count: number, 
		overrideOptions?: BaseOptions
	): Promise<MemoryStoreHashMapPages> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.hashMap.ListItemsAsync(count),
		);
	}

	async remove(
		key: string, 
		overrideOptions?: BaseOptions
	): Promise<void> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.hashMap.RemoveAsync(key),
		);
	}

	async extendLifetime(
		key: string, 
		newLifetime: number, 
		overrideOptions?: Omit<BaseOptions, 'lifetime'>
	): Promise<void> {
		const options = overrideOptions ?? this.options;
		  
		await this.update(key, (oldValue) => oldValue, {
			lifetime: newLifetime,
			...options
		})
	}

	async forEachItem<T>(
		count: number, 
		callback: (item: {key: string, value: T}) => void, 
		overrideOptions?: BaseOptions
	): Promise<number> {
		const pages = await this.listItemsAsPages(count, overrideOptions);
		let pageCount = 0;

		while (true) {
			const entries = pages.GetCurrentPage();

			for (const entry of entries) {
				callback(entry as {key: string, value: T});
			}

			if (pages.IsFinished) {
				return pageCount;
			} else {
				pageCount++;
				pages.AdvanceToNextPageAsync();
			}
		}
	}
}
