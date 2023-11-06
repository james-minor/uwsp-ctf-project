<script setup lang="ts">
import * as feather from 'feather-icons';
import getPrettyPlaceholderString from '../../util/getPrettyPlaceholderString';
import FormFieldSet from '@/components/form/FormFieldSet.vue';

const emit = defineEmits(['update:modelValue', 'input']);

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	name: string,                       // The name of the input field.
	type: string,                       // The type of the input field.
	icon?: feather.FeatherIcon,         // The icon for the input field.
	maxLength?: number,                 // The maximum length of the input field.
	disabled?: boolean,                 // Is the input disabled from editing?
}>();
</script>

<template>
	<FormFieldSet :disabled="props.disabled" :label="props.name" :hide-label="!!props.icon">
		<div v-if="props.icon" :class="{'icon': true, 'disabled': props.disabled}"
		     v-html="props.icon?.toSvg({ stroke: 'white' })"/>
		<input
			:name="props.name"
			:type="props.type"
			:placeholder="getPrettyPlaceholderString(props.name)"
			:maxlength="props.maxLength"

			:value="modelValue"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value); $emit('input', ($event.target as HTMLInputElement).value)"
		>
	</FormFieldSet>
</template>

<style scoped>
input {
	width: 100%;

	flex:             1;
	padding:          0.25rem 0.75rem 0.5rem;
	border:           none;
	outline:          none;

	color:            var(--col-text-dark);
	background-color: transparent;
}

input:disabled {
	color: var(--col-body-dark-300);
}

.icon {
	aspect-ratio:     1;
	background-color: var(--col-main-purple);

	padding:          0.65rem;

	display:          flex;
	align-items:      center;
	justify-content:  center;
}

.icon.disabled {
	filter: saturate(0%);
}

@media (prefers-color-scheme: light) {
	input {
		color:            var(--col-text-light);
		background-color: var(--col-body-light-100);
	}

	input:disabled {
		color: var(--col-body-light-300);
	}
}
</style>