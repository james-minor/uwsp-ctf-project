<script setup lang="ts">
	import feather from 'feather-icons';
	import { useSessionStore } from '@/stores/session';

	const title: string = 'Pointer Overflow CTF';
	const loginSvg: string = feather.icons['log-in'].toSvg({ stroke: 'white' });
	const logoutSvg: string = feather.icons['log-out'].toSvg({ stroke: 'white' });

	const sessionStore = useSessionStore();
</script>

<template>
	<nav>
		<router-link to="/" class="title">{{ title }}</router-link>

		<div class="nav-links">
			<router-link to="/rules">Rules</router-link>
			<router-link to="/challenges">Challenges</router-link>
			<router-link to="/scoreboard">Scoreboard</router-link>
			<router-link v-show="sessionStore.isAuthenticated()" to="/profile">Profile</router-link>
			<router-link v-show="sessionStore.isAuthenticated(true)" to="/admin">Admin</router-link>

			<router-link v-if="sessionStore.session" class="btn" to="/" @click="sessionStore.logout()"><i v-html="logoutSvg"></i> Logout</router-link>
			<router-link v-else to="/login" class="btn"><i v-html="loginSvg"></i> Login</router-link>
		</div>
	</nav>
</template>

<style scoped>
	nav {
		position: fixed;
		top: 0;
		left: 0;

		height: var(--len-navbar-height);
		width: 100%;

		background-color: var(--col-body-dark-100);
		border-bottom-color: var(--col-body-dark-200);
		border-bottom-width: 2px;
		border-bottom-style: solid;

		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;

		padding-left: 1ch;
		padding-right: 1ch;
	}

	.nav-links {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: end;
		column-gap: 2.5ch;
	}

	a {
		display: inline-block;

		text-transform: uppercase;
		text-decoration: none;
		font-size: 0.9rem;

		color: var(--col-text-dark);

		outline: none;
		transition: color 0.2s;
	}

	a:hover,
	a:focus-visible {
		color: var(--col-main-gold);
	}

	.btn {
		background-color: transparent;

		font-size: 0.9rem;

		padding: 0.65rem;

		border-style: solid;
		border-width: thin;
		border-color: var(--col-body-dark-200);
		border-radius: 4px;

		transition: background-color 0.2s;

		outline: none;

		cursor: pointer;

		display: flex;
		align-items: center;
	}

	.btn i {
		padding-right: 1ch;
	}

	.btn:hover,
	.btn:focus-visible {
		background-color: var(--col-main-purple);
		color: var(--col-text-dark);
	}

	.title {
		font-size: 1.5rem;
		font-weight: bold;
	}

	@media (prefers-color-scheme: light)
	{
		nav {
			background-color: var(--col-body-light-100);
		}

		a {
			color: var(--col-body-dark-100);
		}

		a:hover,
		a:focus-visible {
			color: var(--col-body-light-300);
		}

		.btn {
			color: var(--col-text-dark);
			background-color: var(--col-main-purple);
		}

		.btn:hover,
		.btn:focus-visible {
			transform: translateY(-0%);
		}
	}
</style>