<script setup lang="ts">
import * as feather from 'feather-icons';
import type { SelectOption } from '@/types/SelectOption';
import FormFieldSet from '@/components/form/FormFieldSet.vue';
import getPrettyPlaceholderString from '../../util/getPrettyPlaceholderString';

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	name: string,                       // The input name.
	options: SelectOption[],            // The options within the select field.
	disabled?: boolean,                 // Is the select dropdown disabled?
}>();

console.log(`model value for ${props.name}`);
console.log(props.modelValue)
</script>

<template>
	<FormFieldSet :disabled="props.disabled" :label="props.name">
		<select
			:disabled="props.disabled"

			@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		>
			<option value="" :selected="props.modelValue === '' || props.modelValue === null" disabled hidden>Select a {{ getPrettyPlaceholderString(name) }}</option>
			<option
				v-for="option in props.options"
				:value="option.value"
				:selected="option.value == props.modelValue"
			>
				{{ option.text }}
			</option>
		</select>
		<div v-if="!props.disabled" class="select__arrow" v-html="feather.icons['chevron-down'].toSvg()"/>
	</FormFieldSet>
</template>

<style scoped>
.select__arrow {
	position:       absolute;
	top:            50%;
	transform:      translateY(-50%);
	right:          0.5rem;
	pointer-events: none;
}

select {
	appearance:       none;
	width:            100%;
	height:           100%;
	padding:          0.25rem 0.75rem 0.5rem;

	background-color: transparent;
	outline:          none;
	border:           none;

	color:            var(--col-text-dark);

	cursor:           pointer;
}

option {
	color: var(--col-text-light);
}

select:disabled {
	color:  var(--col-body-dark-300);
	cursor: default;
}

@media (prefers-color-scheme: light) {
	select {
		color: var(--col-text-light);
	}

	select:disabled {
		color: var(--col-body-light-300);
	}
}
</style>