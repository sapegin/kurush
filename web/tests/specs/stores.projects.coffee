'use strict'

describe 'stores/projects', ->
	before (done) ->
		requireModule {'stores/projects': 'ProjectsStore'}, done

	it 'should create new model', (done) ->
		projects = new ProjectsStore.ProjectsCollection()
		expect(projects.length).to.equal(0)
		projects.create({name: 'Kurush'})
		expect(projects.length).to.equal(1)
		done()
