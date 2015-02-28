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

	it 'getNames() should return list of project names', (done) ->
		projects = new ProjectsStore.ProjectsCollection()
		expect(projects.getNames()).to.deep.equal([])
		projects.create({name: 'Project 1'})
		projects.create({name: 'Project 2'})
		expect(projects.getNames()).to.deep.equal(['Project 1', 'Project 2'])
		done()
