'use strict'

_ = require 'lodash'
moment = require 'moment'

describe 'collections/tasks', ->
	before (done) ->
		requireModule ['collections/tasks', 'models/task'], ['Tasks', 'Task'], done

	beforeEach ->
		Tasks.getInstance().reset([
			{name: 'Task 1', project: 'Project 1', state: Task.STATE_UNPAID, changed: moment('2014-01-12').unix()},
			{name: 'Task 3', project: 'Project 1', state: Task.STATE_IN_PROGRESS, changed: moment('2014-03-12').unix()},
			{name: 'Task 2', project: 'Project 1', state: Task.STATE_NEW, changed: moment('2014-12-12').unix()},
			{name: 'Task 4', project: 'Project 3', state: Task.STATE_SUSPENDED, changed: moment('2014-06-12').unix()},
			{name: 'Task 5', project: 'Project 2', state: Task.STATE_NEW, changed: moment('2014-04-12').unix()},
			{name: 'Task 6', project: 'Project 1', state: Task.STATE_SUSPENDED, changed: moment('2014-01-12').unix()},
			{name: 'Task 7', project: 'Project 1', state: Task.STATE_CLOSED, changed: moment('2014-08-12').unix()},
			{name: 'Task 8', project: 'Project 2', state: Task.STATE_NOT_STARTED, changed: moment('2014-09-12').unix()},
			{name: 'Task 9', project: 'Project 2', state: Task.STATE_IN_PROGRESS, changed: moment('2014-01-12').unix()},
			{name: 'Task 10', project: 'Project 1', state: Task.STATE_UNPAID, changed: moment('2014-11-12').unix()},
			{name: 'Task 11', project: 'Project 3', state: Task.STATE_NEW, changed: moment('2014-12-12').unix(), new: true},
			{name: 'Task 12', project: 'Project 1', state: Task.STATE_NOT_STARTED, changed: moment('2014-01-12').unix()}
		])

	it 'should sort collection', ->
		#_.each Tasks.getInstance().models, (task) ->
		#	console.log [task.get('name'), task.getStateName(), moment.unix(task.get('changed')).format('YYYY-MM-DD')].join('\t')
		tasks = _.pluck(Tasks.getInstance().toJSON(), 'name')
		expect(tasks).to.deep.equal([
			'Task 3',
			'Task 9',
			'Task 8',
			'Task 12',
			'Task 11',
			'Task 2',
			'Task 5',
			'Task 4',
			'Task 6',
			'Task 10',
			'Task 1',
			'Task 7'
			])

	it 'should create new model', ->
		tasks = Tasks.getInstance()
		length = tasks.length
		tasks.create({name: 'Do someting'})
		expect(tasks.length).to.equal(length + 1)



# sort items
