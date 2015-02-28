'use strict'

_ = require('lodash')

describe 'dispatcher', ->
	result = 0
	actions = {
		one:
			(payload) ->
				result = 1
		two:
			(payload) ->
				result = payload
	}

	before (done) ->
		requireModule {'dispatcher': 'Dispatcher'}, done

	beforeEach (done) ->
		@dispatcher = new Dispatcher.AppDispatcher()
		@dispatcher.registerActions(actions)
		done()

	it 'registerActions() should create function for every action', (done) ->
		@dispatcher.registerActions(actions)
		numberOfActions = _.size(@dispatcher.actions)
		expect(numberOfActions).to.equal(_.size(actions))
		expect(@dispatcher.actions.one).to.be.function
		expect(@dispatcher.actions.two).to.be.function
		done()

	it 'dispatchAction() should invoke given action and pass payload', (done) ->
		@dispatcher.dispatchAction('two', {test: 1})
		expect(result).to.be.deep.equal({actionType: 'two', test: 1})
		done()

	it 'dispatchAction() should works without payload', (done) ->
		dispatch = =>
			@dispatcher.dispatchAction('one')
		expect(dispatch).to.not.throw()
		done()

	it 'actions should work when invoked via shortcuts', (done) ->
		@dispatcher.registerActions(actions)
		@dispatcher.actions.one()
		expect(result).to.be.equal(1)
		done()
