'use strict'

_ = require 'lodash'
moment = require 'moment'

describe 'stores/tasks', ->
	before (done) ->
		requireModule {'stores/tasks': 'TasksStore', 'models/task': 'Task', 'dispatcher': 'Dispatcher'}, done

	beforeEach (done) ->
		@TasksStore = new TasksStore.TasksCollection()
		@TasksStore.reset([
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
		done()

	it 'should sort collection', (done) ->
		#_.each @TasksStore.models, (task) ->
		#	console.log [task.get('name'), task.getStateName(), moment.unix(task.get('changed')).format('YYYY-MM-DD')].join('\t')
		tasks = _.pluck(@TasksStore.toJSON(), 'name')
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
		done()

	it 'actions.createTask() should create new model', (done) ->
		numberOfTasksBefore = @TasksStore.length
		Dispatcher.actions.createTask({name: 'Do someting'})
		numberOfTasks = @TasksStore.length
		expect(numberOfTasks).to.equal(numberOfTasksBefore + 1)
		done()

	it 'actions.updateTask() should update a model', (done) ->
		model = TasksStore.create({name: 'Do someting'})
		Dispatcher.actions.updateTask({model: model, attributes: {name: 'Do someting else'}})
		expect(model.get('name')).to.equal('Do someting else')
		done()
