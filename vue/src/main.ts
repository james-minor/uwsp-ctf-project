import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import router from './router/router';

import App from './App.vue';

import './assets/main.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');

/* Maintaining the pinia state when refreshing the browser window.
 */
watch(
	pinia.state,
	(state) =>
	{
		/* Stringify any session-persistent stores here.
		 */
		sessionStorage.setItem('session', JSON.stringify(state.session))
	},
	{
		deep: true,
	}
);