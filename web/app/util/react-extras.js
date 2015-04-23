import _ from 'lodash';
import StateStore from '../stores/StateStore';

React.KurushMixin = {
	get(field) {
		return this.props.model.get(field);
	},

	getFormData(form) {
		let values = {};
		_.each(this.refs, function(ref, name) {
			const node = ref.getDOMNode();
			if (!node.name || !form.contains(node)) {
				return;
			}
			if ('value' in node) {
				values[name] = node.value;
			}
			else if ('getValue' in ref) {
				values[name] = ref.getValue();
			}
		});
		return values;
	},

	getAttrs() {
		return _.omit(this.props, _.keys(this.constructor.defaultProps));
	}
};

React.AppStateMixin = {
	getInitialState() {
		return this._getStateFromStore();
	},

	componentDidMount() {
		StateStore.on('change', this._setStateFromStore);
	},

	componentWillUnmount() {
		StateStore.off('change');
	},

	_getStateFromStore() {
		return StateStore.toJSON();
	},

	_setStateFromStore() {
		if (this.isMounted()) {
			this.setState(this._getStateFromStore());
		}
	}
};

React.createExtendedClass = function(spec) {
	var currentMixins = spec.mixins || [];

	spec.mixins = currentMixins.concat([
		React.KurushMixin
	]);

	return React.createBackboneClass(spec);
};

export default React;
