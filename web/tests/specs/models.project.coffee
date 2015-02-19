'use strict'

describe 'models/project', ->
	before (done) ->
		requireModule {'models/project': 'Project'}, done

	it 'has default values', (done) ->
		model = new Project()
		expect(model.get('name')).to.equal('')
		done()
