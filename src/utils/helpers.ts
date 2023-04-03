export function levelCurve(level: number) {
	let baseXp = 100;
	let exponent = 1.5;

	return Math.floor(baseXp * (level ^ exponent));
}