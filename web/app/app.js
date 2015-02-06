define(function(require, exports, module) {
	'use strict';

	// Test data
	var Tasks = require('collections/tasks');
	Tasks.getInstance().add([
		{ id: 1, name: 'Tasks 1', project: 'Kurush', client: 'Me' },
		{ id: 2, name: 'Tasks 2', project: 'Kurush', client: 'Me' },
		{ id: 3, name: 'Tasks 3', project: 'Kurush', client: 'Me' },
		{ id: 4, name: 'Tasks 4', project: 'Kurush', client: 'Me' },
		{ id: 5, name: 'Tasks 5', project: 'Kurush', client: 'Me' },
		{ id: 6, name: 'Tasks 6', project: 'Kurush', client: 'Me' },
		{ id: 7, name: 'Tasks 7', project: 'Kurush', client: 'Me' },
		{ id: 8, name: 'Tasks 8', project: 'Kurush', client: 'Me' },
		{ id: 9, name: 'Tasks 9', project: 'Kurush', client: 'Me' },
		{ id: 10, name: 'Tasks 10', project: 'Kurush', client: 'Me' },
		{ id: 11, name: 'Tasks 11', project: 'Kurush', client: 'Me' },
		{ id: 12, name: 'Tasks 12', project: 'Kurush', client: 'Me' },
		{ id: 13, name: 'Tasks 13', project: 'Kurush', client: 'Me' },
		{ id: 14, name: 'Tasks 14', project: 'Kurush', client: 'Me' },
	]);

	exports.root = '/';
});
