import Dashboard from './components/Dashboard.html';
import Story from './components/Story.html';
// import { Store } from 'svelte/store.js';
//
// const store = new Store({
// 	name: 'world'
// });

const DashboardComponent = new Dashboard({
	target: document.querySelector('.app')
});

const StoryComponent = new Story({
	target: document.querySelector('.story')
});
