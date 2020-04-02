let Line = require('./line.js');
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

	getSegmentAtIndex(index) {
		if(0 <= index && index < this.segments.length) {
			return this.segments[index];
		} else {
			return null;
		}
	}

	getLastSegment() {
		return this.segments[this.segments.length - 1];
	}

	getLastEvent() {
		return this.getLastSegment().end;
	}

	getLastVelocity() {
		return this.getLastSegment().velocity;
	}

	setEnd(t) {
		let lastSegment = this.getLastSegment();
		if(t < lastSegment.t) {
			throw new Error("Cannot change velocity during defined path!");
		}
		let changeEvent = lastSegment.getEventatT(t);
		lastSegment.setEnd(changeEvent);
	}

	extend(velocity, t) {
		this.setEnd(t);
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

	getSegmentStartTime(index) {
		return this.segments[index].event.t;
	}

	intersectLast(worldline) {
		return this.getLastSegment().getEventAtIntersection(worldline.getLastSegment());
	}

	// Implements a binary search because the segments are already ordered
	getIndexAtT(t) {
		if(t < this.getSegmentStartTime(0)) {
			return -1;
		}
		let start = 0, end = this.segments.length;
		let mid;
		while(start < end - 1) {
			mid = Math.floor((start + end) / 2);
			if(this.getSegmentStartTime(mid) > t) {
				end = mid;
			} else if(this.getSegmentStartTime(mid) < t) {
				start = mid;
			} else {
				return mid;
			}
		}
		return start;
	}

	getSegmentAtT(t) {
		return this.getSegmentAtIndex(this.getIndexAtT(t));
	}

	getEventAtT(t) {
		return this.getSegmentAtIndex(this.getIndexAtT(t)).getEventAtT(t);
	}

	getIntersectingEvents(line) {
		return this.segments.map(segment => segment.getEventAtIntersection(line)).filter(event => event != null);
	}

	getIntersectingSegments(line) {
		return this.segments.map(segment => segment.getEventAtIntersection(line) && segment).filter(a => a);
	}

	getIntersectingIndices(line) {
		return this.segments.map((segment, index) => segment.getEventAtIntersection(line) ? index : -1).filter(a => a != -1);
	}
}