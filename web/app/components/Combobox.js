// Author: Artem Sapegin http://sapegin.me, 2015

import newId from '../util/newid';

const PT = React.PropTypes;

export default React.createExtendedClass({
	displayName: 'Combobox',
	propTypes: {
		items: PT.array,
		value: PT.string
	},

	getDefaultProps() {
		return {
			items: [],
			value: ''
		};
	},

	getValue() {
		return this.refs.input.getDOMNode().value;
	},

	render() {
		const listId = newId();
		const options = this.props.items.map((value) => {
			return (
				<option key={value}>{value}</option>
			);
		});

		return (
			<div>
				<input defaultValue={this.props.value} list={listId} ref="input" {...this.getAttrs()}/>
				<datalist id={listId}>
					{options}
				</datalist>
			</div>
		);
	}
});
