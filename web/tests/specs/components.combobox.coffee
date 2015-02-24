# Author: Artem Sapegin http://sapegin.me, 2015

'use strict'

describe 'components/combobox', ->
	defaultProps = {
		items: ['one', 'two', 'three'],
		value: 'two'
	}

	render = (props=defaultProps) ->
		renderReactComponent Combobox, props

	before (done) ->
		requireModule {'components/combobox': 'Combobox', 'react': 'React'}, ->
			global.TestUtils = React.addons.TestUtils
			done()

	it 'should be component of type Combobox', (done) ->
		[element, node] = render()
		isCompositeComponentOfType = TestUtils.isCompositeComponentWithType(element, Combobox)
		expect(isCompositeComponentOfType).to.be.true
		done()

	it 'should have <option> tag for every item', (done) ->
		[element, node] = render()
		numberOfOptions = node.querySelectorAll('datalist option').length
		expect(numberOfOptions).to.equal(defaultProps.items.length)
		done()

	it 'getValue() should return value of input field', (done) ->
		[element, node] = render()
		value = element.getValue()
		expect(value).to.equal(defaultProps.value)
		done()
