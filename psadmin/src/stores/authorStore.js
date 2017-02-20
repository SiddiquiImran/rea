"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');

var ActionTypes = require('../constants/actionTypes');

var EventEmitter = require('events').EventEmitter;

var assign = require('object-assign');

var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _authors = [];

var AuthorStore = assign({}, EventEmitter.proptype, {

	addChangeListener: function (callback) {
		// body...
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		// body...
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function () {
		// body...
		this.emit(CHANGE_EVENT);
	},

	getAllAuthors: function () {
		// body...
		return _authors;
	},

	getAuthorById: function (id) {
		// body...
		return _.find(_authors, { id: id });
	}
});

Dispatcher.register(function(action) {
	// body...
	switch(action.actionType) {

		case ActionTypes.CREATE_AUTHOR:
		_authors.push(action.author);
		AuthorStore.emitChange();
		break;

		default:
		break;
	}
});

module.exports = AuthorStore;