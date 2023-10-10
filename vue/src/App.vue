<script setup lang="ts">
	import { provide } from 'vue';
	import { apiBaseURL } from '@/APIBaseURL';

	provide('apiBaseURL', apiBaseURL);
</script>

<template>
	<main>
		<router-view></router-view>
	</main>
</template>

<style scoped>
	main {
		min-height: 100svh;
	}
</style>
