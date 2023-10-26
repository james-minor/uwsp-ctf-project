<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input']);

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	name: string,                       // The name associated with the textarea.
	error?: string,                     // The error message associated with the textarea.
	maxLength?: number,                 // The maximum length of the textarea field.
	disabled?: boolean,                 // Is the textarea disabled from editing?
}>();

// TODO: we should have a non-visible label for screen readers.
</script>

<template>
	<textarea
		:name="props.name"
		:placeholder="props.name[0].toUpperCase() + props.name.substring(1) + '...'"
		:maxlength="props.maxLength"
		:disabled="props.disabled"

		:value="modelValue"
		@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value); emit('input')"
	></textarea>
	<em v-if="props.error !== undefined">{{ props.error }}</em>
</template>

<style scoped>
em {
	display:       block;
	height:        2rem;

	margin-top:    0.25rem;
	margin-bottom: 1rem;

	font-style:    normal;
	font-size:     0.9rem;
	font-weight:   bold;

	color:         var(--col-accent-red)
}

textarea {
	width: 100%;
	resize: none;

	padding:          0.5rem 0.75rem;
	outline:          none;

	color:            var(--col-text-dark);
	background-color: var(--col-body-dark-100);

	border:         2px solid var(--col-body-dark-200);
	border-radius:  6px;
}

textarea:disabled {
	color: var(--col-body-dark-300);
	background-color: var(--col-body-dark-200);
}

textarea:focus-visible {
	outline: var(--col-accent-violet-nt) solid 2px;
}
</style>