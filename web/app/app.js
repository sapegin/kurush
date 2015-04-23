// Author: Artem Sapegin http://sapegin.me, 2015

import Backbone from 'backbone';
import './bootstrap';
import Router from './router';

new Router();

// Trigger the initial route and enable HTML5 History API support, set the root folder
Backbone.history.start({pushState: true, root: '/'});
