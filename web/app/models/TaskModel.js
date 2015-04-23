// Author: Artem Sapegin http://sapegin.me, 2015

import _ from 'lodash';
import moment from 'moment';
import Backbone from 'backbone';
import ProjectsStore from '../stores/ProjectsStore';

export default Backbone.Model.extend({
	defaults: {
		name: '',
		project: null,
		state: 1,
		summ: null,
		rate: null,
		notes: '',
		minutesSpent: 0,
		created: null,
		updated: null,
		finished: null
	},

	states: {
		1: 'New',
		2: 'Not started',
		3: 'In progress',
		4: 'Suspended',
		5: 'Unpaid',
		6: 'Closed'
	},

	initialize(attributes = {}) {
		if (!attributes.created) {
			this.set('created', this.now());
		}
	},

	getProjectName() {
		var project = ProjectsStore.get(this.get('project'));
		return project && project.get('name');
	},

	getStateName() {
		return this.states[this.get('state')];
	},

	getStateIdByName(name) {
		return Number(_.invert(this.states)[name]);
	},

	getSatesList() {
		return this.states;
	},

	set(attributes, options) {
		// Skip set('field', value) calls, maybe support them later
		if (_.isObject(attributes)) {

			// State should be a number
			if ('state' in attributes) {
				attributes.state = Number(attributes.state);
			}

			attributes.project = this.replaceValueWithId(attributes.project, ProjectsStore);

			// set({}, {update: true})
			if (options && options.update) {
				// Update time
				attributes.updated = this.now();

				// Task finished: moved to Unpaid or Closed
				const finishedStates = [this.getStateIdByName('Unpaid'), this.getStateIdByName('Closed')];
				if (attributes.state && _.include(finishedStates, attributes.state) && !_.include(finishedStates, this.get('state'))) {
					attributes.finished = this.now();
				}
			}
		}

		return Backbone.Model.prototype.set.call(this, attributes, options);
	},

	now() {
		return moment().unix();
	},

	replaceValueWithId(value, collection) {
		if (this.isRawValue(value)) {
			let project = collection.where({name: value})[0];
			if (!project) {
				project = collection.create({name: value});
			}
			return project.get('id');
		}
		return value;
	},

	isRawValue(value) {
		return !_.isEmpty(value) && !this.isUuid(value);
	},

	isUuid(string) {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(string);
	}
}, {
	STATE_NEW: 1,
	STATE_NOT_STARTED: 2,
	STATE_IN_PROGRESS: 3,
	STATE_SUSPENDED: 4,
	STATE_UNPAID: 5,
	STATE_CLOSED: 6
});
