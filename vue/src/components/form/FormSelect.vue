<script setup lang="ts">
import * as feather from 'feather-icons';
import type { SelectOption } from '@/types/SelectOption';

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	options: SelectOption[],            // The options within the select field.
	disabled?: boolean,                 // Is the select dropdown disabled/
}>();

</script>

<template>
	<div class="select-wrapper" :class="{ 'disabled': props.disabled }">
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
	</div>
</template>

<style scoped>
.select-wrapper {
	position:         relative;

	width:            100%;
	outline:          none;

	background-color: var(--col-body-dark-100);

	border:           2px solid var(--col-body-dark-200);
	border-radius:    6px;
}

.select-wrapper.disabled {
	background-color: var(--col-body-dark-200);
}

.select-wrapper:focus-within {
	outline: var(--col-accent-violet-nt) solid 2px;
}

.select__arrow {
	position:  absolute;
	top:       50%;
	transform: translateY(-50%);
	right:     0.5rem;
}

select {
	appearance:       none;
	width:            100%;
	height:           100%;
	padding:          0.5rem 0.75rem;

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