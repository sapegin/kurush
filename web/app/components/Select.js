// Author: Artem Sapegin http://sapegin.me, 2015

import _ from 'lodash';

const PT = React.PropTypes;

export default React.createExtendedClass({
	displayName: 'Select',
	propTypes: {
		items: PT.object,
		value: PT.any
	},

	getDefaultProps() {
		return {
			items: {},
			value: ''
		};
	},

	getValue() {
		return this.refs.select.getDOMNode().value;
	},

	render() {
		const options = _.map(this.props.items, (name, value) => {
			return (
				<option value={value} key={value}>{name}</option>
			);
		});

		return (
			<select ref="select" defaultValue={this.props.value} {...this.getAttrs()}>
				{options}
			</select>
		);
	}
});
