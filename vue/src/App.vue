<script setup lang="ts">
	import { provide } from 'vue';
	import NavigationBar from './components/NavigationBar.vue';

	if (import.meta.env.VITE_API_URL === undefined)
	{
		provide('apiBaseURL', 'http://127.0.0.1:80/api')
	}
	else
	{
		provide('apiBaseURL', import.meta.env.VITE_API_URL);
	}

</script>

<template>
	<navigation-bar/>
	<main>
		<router-view></router-view>
	</main>
</template>

<style scoped>
	main {
		padding-top: var(--len-navbar-height);
	}
</style>
