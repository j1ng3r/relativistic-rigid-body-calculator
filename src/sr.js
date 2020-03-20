module.exports = {
	addVelocities: (u, v) => (u + v) / (1 + u * v),
	isInfinite: x => !isFinite(x),
	gamma: v => 1 / Math.sqrt(1 - v**2),
	alpha: v => Math.sqrt((1 - v) / (1 + v)),
	RIGHT: 1,
	LEFT: -1,
};