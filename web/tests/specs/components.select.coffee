# Author: Artem Sapegin http://sapegin.me, 2015

'use strict'

describe 'components/select', ->
	defaultProps = {
		items: {
			1: 'one',
			2: 'two',
			3: 'three'
		},
		value: '1'
	}

	render = (props=defaultProps) ->
		renderReactComponent Select, props

	before (done) ->
		requireModule {'components/select': 'Select', 'react': 'React'}, ->
			global.TestUtils = React.addons.TestUtils
			done()

	it 'should be component of type Select', (done) ->
		[element, node] = render()
		isCompositeComponentOfType = TestUtils.isCompositeComponentWithType(element, Select)
		expect(isCompositeComponentOfType).to.be.true
		done()

	it 'should have <option> tag for every item', (done) ->
		[element, node] = render()
		numberOfOptions = node.querySelectorAll('select option').length
		expect(numberOfOptions).to.equal(Object.keys(defaultProps.items).length)
		done()

	it 'getValue() should return value of selected option', (done) ->
		[element, node] = render()
		value = element.getValue()
		expect(value).to.equal(defaultProps.value)
		done()
