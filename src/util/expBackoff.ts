export async function exponentialBackoff<T>(base: number, tries: number, callback: () => T, errorCallback?: (e: string) => void): Promise<T> {
	for (const c of $range(1, tries)) {
		const [s, e] = pcall(() => callback);

		if (!s && e) {
			if (errorCallback) errorCallback(e as string);
			task.wait(base^c)
		} else if (s) {
			return e as T;
		}
	}

	error('Max tries reached');
}