<script setup lang="ts">
import feather from 'feather-icons';

defineProps<{
	icon?: feather.FeatherIcon,
	disabled?: boolean,
}>();

</script>

<template>
	<button :disabled="disabled" type="button">
		<i v-if="icon" v-html="icon.toSvg({ stroke: 'white' })"/>
		<slot></slot>
	</button>
</template>

<style scoped>
button {
	display:          flex;
	align-items:      center;
	justify-content:  center;

	column-gap:       1ch;

	color:            var(--col-text-dark);
	background-color: var(--col-body-dark-200);

	outline:          none;
	border:           none;
	border-radius:    5px;

	padding:          0.75rem;

	cursor:           pointer;

	transition:       color 0.2s, background-color 0.2s;
}

button:not(:disabled):hover,
button:not(:disabled):focus-visible {
	background-color: var(--col-main-purple);
}

button:disabled {
	color:  var(--col-body-dark-300);
	cursor: not-allowed;
}

@media (prefers-color-scheme: light) {
	button {
		background-color: var(--col-main-purple);
		box-shadow:       0 2px 2px 0 rgba(0, 0, 0, 0.45);

		transition:       box-shadow 0.05s;
	}

	button:hover,
	button:focus-visible {
		box-shadow: none;
	}

	button:disabled {
		color:            var(--col-text-dark);
		background-color: var(--col-accent-violet-nt);
		box-shadow:       none;
	}
}
</style>