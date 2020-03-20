const sr = require('sr.js');
const Event = require('event.js');

let Line = module.exports = class Line {
	constructor(velocity, event) {
		this.event = event;
		this.velocity = velocity;
	}

	getVelocity() {
		return this.velocity;
	}

	getEventatT(t) {
		if(sr.isInfinite(this.velocity)) {
			return null;
		}
		let event = new Event();
		event.setX(this.velocity * (t - this.event.t) + this.event.x);
		event.setT(t);
		return this.event(event);
	}

	getEventatX(t) {
		if(this.velocity == 0) {
			return null;
		}
		let event = new Event();
		event.setT((x - this.event.x) / this.velocity + this.event.t);
		event.setX(t);
		return this.event(event);
	}

	getEventAtIntersection(line) {
		let event;
		if(this.velocity == line.velocity) {
			event = null;
		} else if(sr.isInfinite(line.velocity)) {
			event = this.getEventatX(line.event.x);
		} else if(sr.isInfinite(this.velocity)) {
			event = line.getEventatX(this.event.x);
		} else {
			let t = (this.velocity*this.event.t - line.velocity*line.event.t - this.x + line.x)/(this.velocity - line.velocity);
			event = this.getEventatT(t)
		}
		return line.event(event);
	}

	shiftBy(event) {
		return new this.constructor(this.velocity, this.event.shiftBy(event));
	}

	boostBy(velocity) {
		return new this.constructor(sr.addVelocities(this.velocity, velocity), this.event.boostBy(velocity));
	}

	boostByVelocityAroundEvent(velocity, event) {
		return new this.constructor(sr.addVelocities(this.velocity, velocity), this.event.boostByVelocityAroundEvent(velocity, event));
	}

	// A function used by subclasses to determine membership of an event
	event(event) {
		return event;
	}
}

Line.Segment = class LineSegment extends Line {
	constructor(velocity, start) {
		super(velocity, start);
		this.end = null;
	}

	setEnd(end) {
		this.end = end;
		return this;
	}

	intersectsTime(t) {
		let startValid = t >= this.event.t;
		let endValid = !(this.end instanceof Event) || t <= this.end.t;
		return startValid && endValid;
	}

	// If this segment contains the event time, return event. Else return null
	event(event) {
		if((event instanceof Event) && this.intersectsTime(event.t)) {
			return event;
		} else {
			return null;
		}
	}

	shiftBy(event) {
		return super.shiftBy(event).setEnd(
			this.end.shiftBy(event));
	}

	boostBy(velocity) {
		return super.boostBy(event).setEnd(
			this.end.boostBy(event));
	}

	boostByVelocityAroundEvent(velocity, event) {
		return super.boostByVelocityAroundEvent(velocity, event).setEnd(
			this.end.boostByVelocityAroundEvent(velocity, event));
	}

	static event(segment, t) {
		if((event instanceof Event) && Line.Segment.segmentIntersectsTime(segment, event.t)) {
			return event;
		} else {
			return null;
		}
	}

	static segmentIntersectsTime(segment, t) {
		if(segment instanceof Line.Segment) {
			return segment.intersectsTime(t);
		} else {
			return true;
		}
	}
}

Line.Signal = class Signal extends Line.Segment {
	constructor(dir, event) {
		if(dir == sr.RIGHT) {
			super(sr.RIGHT, event);
		} else if(dir == sr.LEFT){
			super(sr.LEFT, event);
		} else {
			throw new Error("Signal must be moving RIGHT or LEFT!");
		}
	}
}