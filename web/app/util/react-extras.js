define(function(require, exports, module) {
	'use strict';

	var _ = require('underscore');
	var React = require('react');

	var slice = Array.prototype.slice;

	React.KurushMixin = {
		get: function(field) {
			return this.props.model.get(field);
		},

		getFormData: function(form) {
			var ReactNodeIdToRefName = {};
			for (var refName in this.refs) {
				ReactNodeIdToRefName[this.refs[refName]._rootNodeID] = refName;
			}

			var fields = slice.call(form.elements);
			var values = {};
			fields.forEach(function(field) {
				var refName = ReactNodeIdToRefName[field.getAttribute('data-reactid')];
				if (!refName) return;
				values[refName] = this.refs[refName].getDOMNode().value
			}.bind(this));
			return values;
		}
	};

	React.createExtendedClass = function(spec) {
		var currentMixins = spec.mixins || [];

		spec.mixins = currentMixins.concat([
			React.KurushMixin
		]);

		return React.createBackboneClass(spec);
	};

});
