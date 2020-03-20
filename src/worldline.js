let Line = require('line.js');
let Worldline = module.exports = class Worldline {
	constructor() {}

	mapSegmentsToWorldline(fn) {
		return new Worldline().setSegments(this.segments.map(fn));
	}

	start(velocity, event) {
		this.segments = [new Line.Segment(velocity, event)];
	}

	setSegments(segments) {
		this.segments = segments;
	}

	getLastSegment() {
		return this.segments[this.segments.length - 1];
	}

	getEndEvent() {
		return this.getLastSegment().end;
	}

	end(t) {
		let lastSegment = this.getLastSegment();
		if(t < lastSegment.t) {
			throw new Error("Cannot change velocity during defined path!");
		}
		let changeEvent = lastSegment.getEventatT(t);
		lastSegment.setEnd(changeEvent);
	}

	changeVelocityAtTime(velocity, t) {
		this.end(t);
		this.segments.push(new Line.Segment(velocity, this.getEndEvent()));
	}

	shiftBy(event) {
		return this.mapSegmentsToWorldline(segment => segment.shiftBy(event));
	}

	boostBy(velocity) {
		return this.mapSegmentsToWorldline(segment => segment.boostBy(velocity));
	}

	boostByVelocityAroundEvent(velocity, event) {
		return this.mapSegmentsToWorldline(segment => segment.boostByVelocityAroundEvent(velocity, event));
	}

	getSegmentAtTime() {
		
	}
}