<h1 align="center">
	<a href="https://www.npmjs.com/package/@rbxts/muon">
		<img src="public/logo.svg" alt="Muon" width="200" />
	</a>
	<br />
	<b>Muon</b>
</h1>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@rbxts/muon.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/muon)
[![GitHub license](https://img.shields.io/github/license/artzified/muon?style=for-the-badge)](LICENSE.md)

</div>

## ⚛️ Muon
Muon is a simple memory store library implementation designed with ease of use in mind. It features exponential backoff for every operation in Hash Maps, Queues, and Sorted Maps

## 📦 Installation
To install Muon, use npm:
```bash
npm install @rbxts/muon
```

## 🧪 Usage
```ts
import { Muon } from '@rbxts/muon';

const hashMap = Muon.hashMap('myHashMap', {
	lifetime: 60, // data only exists for 60 seconds
	exponentialBackoff = {
		base: 1.5; // if something fails, it will retry for 1.5 (1.5^1), then 2.25 (1.5^2), ..., and so on till maxTries has been reached
		maxTries: 5; // a maximum of 5 tries before it gives an error
	}
});

(async() => {
	await hashMap.set('count', 1);
	await hashMap.update('count', (oldCount) => ++oldCount); // increments the count. has a side effect of resetting the lifetime of the count

	print(await hashMap.get<number>('count'));
})();
```

Any operation method has an `overrideOptions` parameter, which allows you to specify what options should be used for the operation
```ts
// ...
await hashMap.set('count', 1, { lifetime: 120 }); // use a lifetime of 120 seconds
```

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/artzified/Muon).

## 📄 License
Muon is licensed under the MIT License. See the [LICENSE](https://github.com/artzified/Muon/blob/master/LICENSE) file for more details.