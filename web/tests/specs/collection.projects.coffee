'use strict'

describe 'collections/projects', ->
	before (done) ->
		requireModule ['collections/projects'], ['Projects'], done

	it 'should create new model', ->
		projects = Projects.getInstance()
		expect(projects.length).to.equal(0)
		projects.create({name: 'Kurush'})
		expect(projects.length).to.equal(1)
