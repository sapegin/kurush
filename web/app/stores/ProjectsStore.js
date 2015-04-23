// Author: Artem Sapegin http://sapegin.me, 2015

import _ from 'lodash';
import Backbone from 'backbone';
import ProjectModel from '../models/ProjectModel';

export const ProjectsCollection = Backbone.Collection.extend({
	model: ProjectModel,
	localStorage: new Backbone.LocalStorage('Projects'),

	getNames() {
		return _.pluck(this.toJSON(), 'name');
	}
});

export default new ProjectsCollection();
