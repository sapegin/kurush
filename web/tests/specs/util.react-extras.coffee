# Author: Artem Sapegin http://sapegin.me, 2015

'use strict'

# TODO: create test components instead of using Task and Select

describe 'util/react-extras', ->
	getModel = ->
		TasksCollection.getInstance().create({name: 'Task 1', project: 'Project 1', notes: 'More ponies.', new: true})

	before (done) ->
		requireModule {'util/react-extras': 'React', 'components/task': 'Task', 'components/select': 'Select', 'collections/tasks': 'Tasks'}, ->
			global.TestUtils = React.addons.TestUtils
			done()

	beforeEach (done) ->
		TasksCollection.getInstance().reset()
		done()

	it 'mixins should be available from React namespace', (done) ->
		expect(React).to.have.property('KurushMixin')
		done()

	it 'get() should return value of a model’s field', (done) ->
		model = getModel()
		[element, node] = renderReactComponent(Task, {model: model})
		expect(model.get('name')).to.equal(element.get('name'))
		done()

	it 'getFormData() should return object with form values', (done) ->
		[element, node] = renderReactComponent(Task, {model: getModel()})
		form = element.refs.form.getDOMNode()
		formValues = element.getFormData(form)
		expect(formValues).to.deep.equal({name: 'Task 1', state: '1', notes: 'More ponies.'})
		done()

	it 'getAttrs() should return all props except default', (done) ->
		[element, node] = renderReactComponent(Select, {items: {one: 1, two: 2}, value: 2, title: 'Some title', tabIndex: 4})
		attrs =  element.getAttrs()
		expect(attrs).to.deep.equal({title: 'Some title', tabIndex: 4})
		done()
