<script setup lang="ts">
import getPrettyPlaceholderString from '@/util/getPrettyPlaceholderString';

const props = defineProps<{
	label: string,          // The label for the fieldset.
	disabled: boolean,      // Is the fieldset disabled?

	hideLabel?: boolean,    // Should the label text be hidden?
}>();
</script>

<template>
	<fieldset :disabled="props.disabled">
		<legend v-if="!props.hideLabel">{{ getPrettyPlaceholderString(props.label) }}</legend>
		<slot/>
	</fieldset>
</template>

<style scoped>
fieldset {
	position:       relative;

	width:          100%;

	display:        flex;
	flex-direction: row;

	border:         2px solid var(--col-text-dark);
	border-radius:  6px;

	overflow:       hidden;
}

legend {
	margin-left:    1ch;

	padding-left:   0.5ch;
	padding-right:  0.5ch;

	color:          var(--col-text-dark);
	text-transform: uppercase;

	font-size:      0.75rem;
	height:         0.75rem;
}

fieldset:disabled {
	border-color: var(--col-body-dark-200);
}

fieldset:disabled legend {
	color: var(--col-body-dark-200);
}

fieldset:focus-within {
	border: var(--col-accent-violet-nt) solid 2px;
}

fieldset:focus-within legend {
	color: var(--col-accent-violet-nt);
}

@media (prefers-color-scheme: light) {
	fieldset {
		border-color: var(--col-text-light);
	}

	legend {
		color: var(--col-text-light);
	}

	fieldset:disabled {
		border-color: var(--col-body-light-200);
	}

	fieldset:disabled legend {
		color: var(--col-body-light-200);
	}
}
</style>