'use strict'

_ = require 'lodash'
moment = require 'moment'

describe 'models/task', ->
	before (done) ->
		requireModule {'models/task': 'Task', 'stores/projects': 'ProjectsStore'}, done

	beforeEach (done) ->
		ProjectsStore.reset()
		done()

	it 'isUuid() should check if given string is UUID', (done) ->
		model = new Task()
		expect(model.isUuid('2136f0d8-19e1-1f31-bd58-fc97e7515bbe')).to.be.true
		expect(model.isUuid('Kurush')).to.be.false
		done()

	it 'isRawValue() should check if given string is not empty and not UUID', (done) ->
		model = new Task()
		expect(model.isRawValue('Kurush')).to.be.true
		expect(model.isRawValue('')).to.be.false
		expect(model.isRawValue('2136f0d8-19e1-1f31-bd58-fc97e7515bbe')).to.be.false
		done()

	it 'getStateIdByName() should return sate ID by its name', (done) ->
		model = new Task()
		expect(model.getStateIdByName('New')).to.equal(Task.STATE_NEW)
		expect(model.getStateIdByName('Not started')).to.equal(Task.STATE_NOT_STARTED)
		expect(model.getStateIdByName('In progress')).to.equal(Task.STATE_IN_PROGRESS)
		expect(model.getStateIdByName('Suspended')).to.equal(Task.STATE_SUSPENDED)
		expect(model.getStateIdByName('Unpaid')).to.equal(Task.STATE_UNPAID)
		expect(model.getStateIdByName('Closed')).to.equal(Task.STATE_CLOSED)
		done()

	it 'getSatesList() should return states array', (done) ->
		model = new Task()
		expect(_.size(model.getSatesList())).to.equal(6)
		expect(model.getSatesList()[1]).to.equal('New')
		done()

	it 'now() should return current Unix timestamp in seconds', (done) ->
		model = new Task()
		expect(model.now()).to.equal(moment().unix())
		done()

	it 'has default values', (done) ->
		model = new Task()
		expect(model.get('name')).to.equal('')
		expect(model.get('project')).to.be.null
		expect(model.get('state')).to.equal(1)
		expect(model.get('summ')).to.be.null
		expect(model.get('rate')).to.be.null
		expect(model.get('notes')).to.equal('')
		expect(model.get('updated')).to.be.null
		expect(model.get('finished')).to.be.null
		done()

	it 'has creation date', (done) ->
		model = new Task()
		timestamp = model.get('created')
		expect(timestamp).to.be.a('number')
		created = moment.unix(timestamp)
		expect(created.format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'))
		done()

	it 'should set project ID instead of project name', (done) ->
		model = new Task()
		model.set({project: 'Kurush'})
		expect(model.get('project')).not.to.equal('Kurush')
		expect(model.getProjectName()).to.equal('Kurush')
		expect(model.isUuid(model.get('project'))).to.be.true
		done()

	it 'should set project ID for existing project', (done) ->
		project = ProjectsStore.create({name: 'Kurush2'})
		model = new Task({project: 'Kurush2'})
		expect(model.get('project')).not.to.equal('Kurush2')
		expect(model.getProjectName()).to.equal('Kurush2')
		expect(model.get('project')).to.be.equal(project.get('id'))
		done()

	it 'should set state using state const', (done) ->
		model = new Task()
		model.set({state: Task.STATE_IN_PROGRESS})
		expect(model.get('state')).to.equal(Task.STATE_IN_PROGRESS)
		expect(model.getStateName()).to.equal('In progress')
		done()

	it 'should set update date on update', (done) ->
		model = new Task()
		expect(model.get('updated')).to.be.null
		model.set({state: Task.STATE_IN_PROGRESS}, {update: true})
		timestamp = model.get('updated')
		expect(timestamp).to.be.a('number')
		updated = moment.unix(timestamp)
		expect(updated.format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'))
		done()

	it 'should set finish date when status changes to Unpaid', (done) ->
		model = new Task()
		expect(model.get('finished')).to.be.null
		model.set({state: Task.STATE_UNPAID}, {update: true})
		timestamp = model.get('finished')
		expect(timestamp).to.be.a('number')
		finished = moment.unix(timestamp)
		expect(finished.format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'))
		done()

	it 'should set finish date when status changes to Closed', (done) ->
		model = new Task()
		expect(model.get('finished')).to.be.null
		model.set({state: Task.STATE_CLOSED}, {update: true})
		timestamp = model.get('finished')
		expect(timestamp).to.be.a('number')
		finished = moment.unix(timestamp)
		expect(finished.format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'))
		done()

	it 'should not change finish date when status changes from Unpaid to Closed', (done) ->
		model = new Task()
		expect(model.get('finished')).to.be.null
		model.set({state: Task.STATE_CLOSED}, {update: true})
		model.set('finished', 123456)
		model.set({state: Task.STATE_UNPAID}, {update: true})
		expect(model.get('finished')).to.equal(123456)
		done()
