export function v4 (): string {
	const s4 = function(): string {
		return Math.floor(Math.random() * 0x10000).toString(16);
	};
	return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

export function short (): string {
	const s4 = function(): string {
		return Math.floor(Math.random() * 0x10000).toString(16);
	};
	return s4() + s4();
}
