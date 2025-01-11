import { MemoryStoreService } from "@rbxts/services";
import { QueueOptions, BaseOptions } from "..";
import { exponentialBackoff } from "../util/expBackoff";

export class Queue {
	private queue: MemoryStoreQueue;

	constructor(
		name: string,
		private options: QueueOptions,
	) {
		this.queue = MemoryStoreService.GetQueue(name);
	}

	async insert<T>(
		value: T, 
		priority: number, 
		overrideOptions?: BaseOptions
	): Promise<void> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.queue.AddAsync(value, options.lifetime, priority),
		);
	}

	async readBulk<T>(
		count: number, 
		acceptPartial?: boolean, 
		maxTime?: number, 
		overrideOptions?: BaseOptions
	): Promise<LuaTuple<[items: T[], id: string]>> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.queue.ReadAsync(count, acceptPartial, maxTime) as LuaTuple<[T[], string]>,
		);
	}

	async remove(
		id: string, 
		overrideOptions?: BaseOptions
	): Promise<void> {
		const options = overrideOptions ?? this.options;

		return exponentialBackoff(options.exponentialBackoff.base, options.exponentialBackoff.maxTries, () =>
			this.queue.RemoveAsync(id),
		);
	}

	async enqueue<T>(
		value: T, 
		overrideOptions?: BaseOptions
	): Promise<void> {
		const options = overrideOptions ?? this.options;

		return await this.insert(value, 0, options);
	}

	async dequeueBulk<T>(
		count: number, 
		maxTime?: number, 
		overrideOptions?: BaseOptions
	): Promise<T[]> {
		const options = overrideOptions ?? this.options;

		const [items, ids] = await this.readBulk(count, false, maxTime, options);

		for (const id of ids) {
			await this.remove(id);
		}

		return items as T[];
	}

	async dequeue<T>(
		maxTime?: number, 
		overrideOptions?: BaseOptions
	): Promise<T> {
		const options = overrideOptions ?? this.options;

		return (await this.dequeueBulk(1, maxTime, options))[0] as T;
	}
}