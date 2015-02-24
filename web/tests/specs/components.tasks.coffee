# Author: Artem Sapegin http://sapegin.me, 2015

'use strict'

describe 'components/tasks', ->
	render = () ->
		renderReactComponent Tasks, {collection: TasksCollection.getInstance()}

	before (done) ->
		requireModule {
				'components/tasks': 'Tasks',
				'components/task': 'Task',
				'collections/tasks': 'TasksCollection',
				'react': 'React'
			}, ->
			global.TestUtils = React.addons.TestUtils
			done()

	beforeEach (done) ->
		TasksCollection.getInstance().reset([
			{name: 'Task 1', project: 'Project 1', state: Task.STATE_UNPAID},
			{name: 'Task 2', project: 'Project 2', state: Task.STATE_IN_PROGRESS},
			{name: 'Task 3', project: 'Project 1', state: Task.STATE_NEW},
		])
		done()

	it 'should be component of type Tasks', (done) ->
		[element, node] = render()
		isCompositeComponentOfType = TestUtils.isCompositeComponentWithType(element, Tasks)
		expect(isCompositeComponentOfType).to.be.true
		done()

	it 'should have <Task> component for every task', (done) ->
		[element, node] = render()
		numberOfTaskComponents = TestUtils.scryRenderedComponentsWithType(element, Task).length
		numberOfTaskModels = TasksCollection.getInstance().length
		expect(numberOfTaskComponents).to.equal(numberOfTaskModels)
		done()

