define(function(require, exports, module) {
	'use strict';

	var React = require('react');

	var BackboneViewMixin = {
		get: function(field) {
			return this.props.model.get(field);
		}
	};

	React.createExtendedClass = function(spec) {
		var currentMixins = spec.mixins || [];

		spec.mixins = currentMixins.concat([
			BackboneViewMixin
		]);

		return React.createBackboneClass(spec);
	};

});
