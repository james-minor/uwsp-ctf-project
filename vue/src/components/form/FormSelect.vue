<script setup lang="ts">
import * as feather from 'feather-icons';
import type { SelectOption } from '@/types/SelectOption';
import getPrettyPlaceholderString from '../../util/getPrettyPlaceholderString';
import FormFieldSet from '@/components/form/FormFieldSet.vue';

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	name: string,                       // The input name.
	options: SelectOption[],            // The options within the select field.
	disabled?: boolean,                 // Is the select dropdown disabled/
}>();

</script>

<template>
	<FormFieldSet :disabled="props.disabled" :label="props.name">
		<select
			v-model="props.modelValue"

			:disabled="props.disabled"

			@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		>
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
</style>