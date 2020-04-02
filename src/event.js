const sr = require('./sr.js');

let Event = module.exports = class Event {
	constructor() {}

	getX() {
		return this.x;
	}

	getT() {
		return this.t;
	}

	setT(t) {
		this.t = t;
		return this;
	}

	setX(x) {
		this.x = x;
		return this;
	}

	setTX(t, x) {
		this.t = t;
		this.x = x;
		return this;
	}

	invert() {
		return new this.constructor().setTX(-this.t, -this.x);
	}

	add(event) {
		return new this.constructor().setTX(
			this.t + event.t,
			this.x + event.x
		);
	}

	shiftBy(event) {
		return this.add(event);
	}

	subtract(event) {
		return new this.constructor().setTX(
			this.t - event.t,
			this.x - event.x
		);
	}

	scale(scaleFactor) {
		return new this.constructor().setTX(
			this.t * scaleFactor,
			this.x * scaleFactor
		);
	}

	boostBy(velocity) {
		let gamma = sr.gamma(velocity);
		return new this.constructor().setTX(
			gamma * (this.t - velocity * this.x),
			gamma * (this.x - velocity * this.t)
		);
	}

	boostByVelocityAroundEvent(velocity, event) {
		return this.subtract(event).boostBy(velocity).add(event);
	}
}

Event.Empty = class EmptyEvent extends Event {
	constructor() {
		isEmpty = true;
	}
	
	setT() {
		return new Event.Empty();
	}

	setX() {
		return new Event.Empty();
	}

	setTX() {
		return new Event.Empty();
	}
}