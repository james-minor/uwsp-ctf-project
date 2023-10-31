<script setup lang="ts">

</script>

<template>
	<aside>
		<nav>
			<router-link to="/admin">Dashboard</router-link>
			<router-link to="/admin/announcements">Announcements</router-link>
			<router-link to="/admin/attachments">Attachments</router-link>
			<router-link to="/admin/categories">Categories</router-link>
			<router-link to="/admin/challenges">Challenges</router-link>
			<router-link to="/admin/teams">Teams</router-link>
			<router-link to="/admin/tools">Tools</router-link>
			<router-link to="/admin/users">Users</router-link>
			<router-link to="/admin/waves">Waves</router-link>
		</nav>
	</aside>
</template>

<style scoped>
aside {
	position:           fixed;
	top:                var(--len-navbar-height);
	left:               0;

	width:              var(--len-sidebar-width);
	height:             calc(100% - var(--len-navbar-height));

	background-color:   var(--col-body-dark-100);
	border-right-color: var(--col-body-dark-200);
	border-right-width: 2px;
	border-right-style: solid;
}

nav {
	height:         100%;

	display:        flex;
	flex-direction: column;
	align-items:    stretch;
}

a {
	display:         flex;
	align-items:     center;
	justify-content: center;

	color:           var(--col-text-dark);

	flex:            1;

	text-decoration: none;

	outline:         none;
	transition:      background-color 0.2s;
}

a:focus-visible,
a:hover {
	background-color: var(--col-body-dark-200);
}

@media (prefers-color-scheme: light) {
	aside {
		background-color: var(--col-body-light-100);
	}

	a {
		color: var(--col-text-light);
	}

	a:focus-visible,
	a:hover {
		background-color: var(--col-body-light-200);
	}
}
</style>