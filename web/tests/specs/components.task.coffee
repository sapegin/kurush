# Author: Artem Sapegin http://sapegin.me, 2015

'use strict'

_ = require('lodash')

describe 'components/task', ->
	render = (props) ->
		renderReactComponent Task, props

	createModel = (props) ->
		props = _.merge({name: 'Task 1', project: 'Project 1', state: Task.STATE_IN_PROGRESS}, props)
		Tasks.getInstance().create(props)

	hasForm = (node) ->
		!!node.querySelectorAll('form').length

	before (done) ->
		requireModule {'components/task': 'Task', 'collections/tasks': 'Tasks', 'react': 'React'}, ->
			global.TestUtils = React.addons.TestUtils
			done()

	beforeEach (done) ->
		Tasks.getInstance().reset()
		done()

	it 'should be component of type Task', (done) ->
		[element, node] = render({model: createModel()})
		isCompositeComponentOfType = TestUtils.isCompositeComponentWithType(element, Task)
		expect(isCompositeComponentOfType).to.be.true
		done()

	it 'should render viewer by default', (done) ->
		[element, node] = render({model: createModel()})
		expect(hasForm(node)).to.be.false
		done()

	it 'should render editor when Edit button clicked', (done) ->
		[element, node] = render({model: createModel()})
		editButton = element.refs.edit.getDOMNode()
		TestUtils.Simulate.click(editButton)
		expect(hasForm(node)).to.be.true
		done()

	it 'should render updated viewer when Save button clicked in editor', (done) ->
		model = createModel()
		[element, node] = render({model: model})

		# Enter edit mode
		editButton = element.refs.edit.getDOMNode()
		TestUtils.Simulate.click(editButton)

		# Modify name
		nameInput = element.refs.name.getDOMNode()
		nameInput.value = 'Task 2'
		TestUtils.Simulate.change(nameInput)

		# Save form
		form = element.refs.form.getDOMNode()
		TestUtils.Simulate.submit(form)

		expect(hasForm(node)).to.be.false  # Form closed
		expect(model.get('name')).to.equal('Task 2')  # Model updated
		expect(node.innerHTML).to.contain('Task 2')  # Updated model
		done()

	it 'should render editor for new tasks', (done) ->
		[element, node] = render({model: createModel({new: true})})
		expect(hasForm(node)).to.be.true
		done()
