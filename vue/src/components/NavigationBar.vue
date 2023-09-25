<script setup lang="ts">
	import feather from 'feather-icons';

	const loginSvg: string = feather.icons['log-in'].toSvg({ stroke: 'white' });
</script>

<template>
	<nav>
		<router-link to="/rules">Rules</router-link>
		<router-link to="/challenges">Challenges</router-link>
		<router-link to="/scoreboard">Scoreboard</router-link>
		<router-link to="/login" class="btn"><i v-html="loginSvg"></i> Login</router-link>
	</nav>
</template>

<style scoped>
	nav {
		position: fixed;

		height: var(--len-navbar-height);
		width: 100%;

		background-color: var(--col-body-dark-100);
		border-bottom-color: var(--col-body-dark-200);
		border-bottom-width: thin;
		border-bottom-style: solid;

		display: flex;
		align-items: center;
		justify-content: end;

		column-gap: 2.5ch;
		padding-left: 1ch;
		padding-right: 1ch;
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