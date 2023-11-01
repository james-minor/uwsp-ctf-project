<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input']);

const props = defineProps<{
	modelValue: string,                 // The v-model value.

	name: string,                       // The name associated with the textarea.
	maxLength?: number,                 // The maximum length of the textarea field.
	disabled?: boolean,                 // Is the textarea disabled from editing?
}>();

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
</template>

<style scoped>
textarea {
	width: 100%;
	min-height: 7rem;
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

@media (prefers-color-scheme: light) {
	textarea {
		color: var(--col-text-light);
		background-color: var(--col-body-light-100);
	}

	textarea:disabled {
		color: var(--col-body-light-300);
		background-color: var(--col-body-light-200);
		border-color: var(--col-body-light-200);
	}
}
</style>