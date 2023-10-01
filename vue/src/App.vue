<script setup lang="ts">
	import NavigationBar from './components/NavigationBar.vue';
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
