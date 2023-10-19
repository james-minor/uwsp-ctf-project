<script setup lang="ts">
	import { provide, ref } from 'vue';
	import { apiBaseURL } from '@/APIBaseURL';
	import NavigationBar from '@/components/NavigationBar.vue';
	import AdminSidebar from '@/components/AdminSidebar.vue';
	import router from '@/router/router';

	const navbarVisible = ref<boolean>(true);
	const sidebarVisible = ref<boolean>(false);

	router.beforeEach((to, from) =>
	{
		navbarVisible.value = to.meta.hideMainNav ? !to.meta.hideMainNav : true;
		sidebarVisible.value = to.meta.showAdminNav ? to.meta.showAdminNav : false;
	})

	provide<string>('apiBaseURL', apiBaseURL);
</script>

<template>
	<navigation-bar v-if="navbarVisible"></navigation-bar>
	<admin-sidebar v-if="sidebarVisible"></admin-sidebar>

	<main :class="{ 'sidebarPresent' : sidebarVisible, 'navbarPresent' : navbarVisible }">
		<router-view></router-view>
	</main>
</template>

<style scoped>
	main {
		display: flex;
		flex-direction: column;

		align-items: center;
	}

	.navbarPresent {
		margin-top: var(--len-navbar-height);
	}

	.sidebarPresent {
		margin-left: var(--len-sidebar-width);
	}
</style>
