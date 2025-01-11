import { HashMap } from "./internal/hashMap";
import { Queue } from "./internal/queue";

const DEFAULT_OPTIONS = {
	lifetime: 60, 
	exponentialBackoff: {
		base: 2, 
		maxTries: 3
	}
}

export namespace Muon {
	export function hashMap(name: string, options: HashMapOptions = DEFAULT_OPTIONS): HashMap {
		return new HashMap(name, options);
	}

	export function sortedMap(name: string, options: SortedMapOptions = DEFAULT_OPTIONS): Queue {
		return new Queue(name, options);
	}

	export function queue(name: string, options: QueueOptions = DEFAULT_OPTIONS): Queue {
		return new Queue(name, options);
	}
}

export interface BaseOptions {
	lifetime: number;
	exponentialBackoff: {
		maxTries: number;
		base: number
	}
}

export interface HashMapOptions extends BaseOptions {}
export interface QueueOptions extends BaseOptions {
	invisibilityTimeout?: number;
}
export interface SortedMapOptions extends BaseOptions {
	invisibilityTimeout?: number;
}