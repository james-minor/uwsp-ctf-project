<script setup lang="ts">
import * as feather from 'feather-icons';
import { ref } from 'vue';

const value = ref<string>('');

defineProps<{
	name: string,                               // The name of the input field.
	type: string,                               // The type of the input field
	error: string,                              // The error message associated with the input.
	icon?: feather.FeatherIcon,                 // The icon for the input field.
	onValueChanged: (value: string) => void,    // Callback for when the input text is modified.
	maxLength?: number,                         // The maximum length of the input field.
}>();
</script>

<template>
	<div class="input-container">
		<div class="icon" v-html="icon?.toSvg({ stroke: 'white' })" />
		<input
			:name="name"
			:type="type"
			:placeholder="name[0].toUpperCase() + name.substring(1)"
			@input="onValueChanged(value)"
			v-model="value"
			:maxlength="maxLength"
		>
	</div>
	<em>{{ error }}</em>
</template>

<style scoped>
em {
	display:    block;
	height: 2rem;

	margin-top: 0.25rem;
	margin-bottom: 1rem;

	font-style: normal;
	font-size: 0.9rem;
	font-weight: bold;

	color: var(--col-accent-red)
}

input[type="email"],
input[type="text"],
input[type="password"] {
	padding: 0.5rem 0.75rem;
	border: none;
	outline: none;
}

.input-container {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: 1fr;

	border: black thin solid;
}

.input-container:focus-within {
	outline: var(--col-accent-violet-nt) solid 2px;
}

.icon {
	aspect-ratio: 1;
	background-color: var(--col-main-purple);

	padding: 0.65rem;

	display: flex;
	align-items: center;
	justify-content: center;
}
</style>