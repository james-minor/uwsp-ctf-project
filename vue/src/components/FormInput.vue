<script setup lang="ts">
import * as feather from 'feather-icons';
import FormError from '@/components/form/FormError.vue';

const emit = defineEmits(['update:modelValue', 'input']);

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	name: string,                       // The name of the input field.
	type: string,                       // The type of the input field.
	error?: string,                     // The error message associated with the input.
	icon?: feather.FeatherIcon,         // The icon for the input field.
	maxLength?: number,                 // The maximum length of the input field.
	disabled?: boolean,                 // Is the input disabled from editing?
}>();

// TODO: we should have a non-visible label for screen readers.
</script>

<template>
	<div :class="['input-container', props.disabled ? 'disabled' : '']">
		<div v-if="props.icon" class="icon" v-html="props.icon?.toSvg({ stroke: 'white' })"/>
		<input
			:name="props.name"
			:type="props.type"
			:placeholder="props.name[0].toUpperCase() + props.name.substring(1)"
			:maxlength="props.maxLength"
			:disabled="props.disabled"

			:value="modelValue"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value); emit('input')"
		>
	</div>
	<FormError :error="props.error" />
</template>

<style scoped>
input {
	flex:             1;
	padding:          0.5rem 0.75rem;
	border:           none;
	outline:          none;

	color:            var(--col-text-dark);
	background-color: var(--col-body-dark-100);
}

input:disabled {
	color:            var(--col-body-dark-300);
	background-color: var(--col-body-dark-200);
}

.input-container {
	display:        flex;
	flex-direction: row;

	border:         2px solid var(--col-body-dark-200);
	border-radius:  6px;

	overflow:       hidden;
}

.input-container:focus-within {
	outline: var(--col-accent-violet-nt) solid 2px;
}

.icon {
	aspect-ratio:     1;
	background-color: var(--col-main-purple);

	padding:          0.65rem;

	display:          flex;
	align-items:      center;
	justify-content:  center;
}

.input-container.disabled {
	border-color: var(--col-body-dark-200);
}

.input-container.disabled .icon {
	filter: saturate(0%);
}

@media (prefers-color-scheme: light) {
	input {
		color: var(--col-text-light);
		background-color: var(--col-body-light-100);
	}

	input:disabled {
		color: var(--col-body-light-300);
		background-color: var(--col-body-light-200);
	}

	.input-container.disabled {
		border-color: var(--col-body-light-200);
	}
}
</style>