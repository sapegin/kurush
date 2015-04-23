import Backbone from 'backbone';
import ProjectsStore from './stores/ProjectsStore';
import TasksStore from './stores/TasksStore';
import StateStore from './stores/StateStore';
import Index from './components/Index';

ProjectsStore.fetch();
TasksStore.fetch();
StateStore.fetch();

export default Backbone.Router.extend({
	routes: {
		'': 'index'
	},

	index() {
		renderView(<Index tasks={TasksStore}/>);
	}
});

// Helpers
var renderView = function (view) {
	var root = document.getElementById('app');
	React.unmountComponentAtNode(root);
	React.render(view, root);
};
