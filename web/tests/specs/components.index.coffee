# Author: Artem Sapegin http://sapegin.me, 2015

'use strict'

describe 'components/index', ->
	render = ->
		renderReactComponent Index, {tasks: Tasks.getInstance()}

	before (done) ->
		requireModule {'components/index': 'Index', 'collections/tasks': 'Tasks', 'react': 'React'}, ->
			global.TestUtils = React.addons.TestUtils
			done()

	it 'should be component of type Index', (done) ->
		[element, node] = render()
		isCompositeComponentOfType = TestUtils.isCompositeComponentWithType(element, Index)
		expect(isCompositeComponentOfType).to.be.true
		done()

	it 'should create new task when Create button clicked', (done) ->
		[element, node] = render()

		oldNumberOfTasks = Tasks.getInstance().length

		createButton = element.refs.create.getDOMNode()
		TestUtils.Simulate.click(createButton)

		numberOfTasks = Tasks.getInstance().length
		model = Tasks.getInstance().models[0]

		expect(numberOfTasks).to.equal(oldNumberOfTasks + 1)  # Number of tasks in collection increased
		expect(model.get('new')).to.be.true  # Created task has `new` attribute

		done()
