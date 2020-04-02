const sr = require('./sr.js');
const Line = require('./line.js');
const Worldline = require('./worldline.js');

let Region = module.exports = class Region {
	constructor(bottomEvent) {
		this.bottomEvent = bottomEvent;
		this.leftWorldline = new Worldline().start(sr.LEFT, bottomEvent);
		this.rightWorldline = new Worldline().start(sr.RIGHT, bottomEvent);
	}

	setLeftEvent(event) {
		this.leftWorldline.extend(sr.RIGHT, event.t);
		if(this.rightWorldline.getLastVelocity() == sr.LEFT) {
			this.calcTopEvent();
		}
	}

	setRightEvent(event) {
		this.rightWorldline.extend(sr.RIGHT, event.t);
		if(this.leftWorldline.getLastVelocity() == sr.RIGHT) {
			this.calcTopEvent();
		}
	}

	calcTopEvent() {
		this.topEvent = this.leftWorldline.intersectLast(this.rightWorldline);
		this.leftWorldline.setEnd(this.topEvent);
		this.rightWorldline.setEnd(this.topEvent);
	}

	collisionEventWith(region) {
		if(this.bottomEvent.x < region.bottomEvent.x) {
			//This is to the left of region
			return this.rightWorldline.intersectLast(region.leftWorldline);
		} else if(region.x < this.bottomEvent.x) {
			//This is to the right of region
			return this.leftWorldline.intersectLast(region.rightWorldline);
		}
	}
}

