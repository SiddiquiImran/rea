"use strict";

var React = require('react');

var Router = require('react-router');

var AuthorForm = require('./authorForm');

var AuthorActions = require('../../actions/authorActions');

var AuthorStore = require('../../stores/authorStore');

//var AuthorApi = require('../../api/authorApi');

var Toastr = require('toastr');

var ManageAuthorPage = React.createClass({

	mixins: [
		Router.Navigation
	],

	statics: {
		willTransitionFrom: function(transition, component) {
			// body...
			if(component.state.dirty && !confirm("leave without saving?")){
				transition.abort();
			}
		}
	},

	getInitialState: function() {
		// body...
		return {
			author: { id: '', firstName: '', lastname: '' },
			errors: {},
			dirty: false
		};
	},

	componentWillMount: function (argument) {
		// body...
		var authorId = this.props.params.id; // from the url 

		if(authorId) {
			this.setState({ author: AuthorStore.getAuthorById(authorId) });
		}
	},

	setAuthorState: function(event) {
		// body...
		this.setState({dirty: true});
		var field = event.target.name;
		var value = event.target.value;
		this.state.author[field] = value;
		return this.setState({author: this.state.author});
	},

	saveAuthor: function(event) {
		event.preventDefault();

		if(!this.authorFormIsValid()){
			return;
		}

		AuthorActions.createAuthor(this.state.author);
		this.setState({dirty: false});
		Toastr.success('Author Saved');
		this.transitionTo('authors');
	},

	authorFormIsValid: function () {
		// body...
		var formIsValid = true;
		this.state.errors = {}; // clear any previous errors

		if(this.state.author.firstName.length < 3) {
			this.state.errors.firstName = 'First name must be at least 3 characters long.';
			formIsValid = false;
		}

		if(this.state.author.lastName.length < 3) {
			this.state.errors.lastName = 'Last name must be at least 3 characters long.';
			formIsValid = false;
		}

		this.setState({errors: this.state.errors});
		return formIsValid;
	},

	render: function() {
		return (
			<AuthorForm 
				author={this.state.author}
				onChange={this.setAuthorState}
				onSave={this.saveAuthor}
				errors={this.state.errors} />
		);
	}

});

module.exports = ManageAuthorPage;