<script setup lang="ts">
import feather from 'feather-icons';

defineProps<{
	icon: feather.FeatherIcon,
}>();

</script>

<template>
	<button type="button">
		<i v-html="icon.toSvg({ stroke: 'white' })"/>
	</button>
</template>

<style scoped>
button {
	aspect-ratio: 1;

	background-color: transparent;

	outline:          none;
	border:           thin solid var(--col-text-dark);
	border-radius:    5px;

	padding:          0.65rem;

	cursor:           pointer;

	transition:       background-color 0.2s, border-color 0.1s;
}

button:hover,
button:focus-visible {
	background-color: var(--col-main-purple);
	border-color:     var(--col-main-purple);
}

@media (prefers-color-scheme: light) {
	button {
		background-color: var(--col-main-purple);
		border-color:     var(--col-main-purple);

		box-shadow:       0 2px 2px 0 rgba(0, 0, 0, 0.45);

		transition:       box-shadow 0.05s;
	}

	button:hover,
	button:focus-visible {
		box-shadow: none;
	}
}
</style>