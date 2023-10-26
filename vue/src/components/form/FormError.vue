<script setup lang="ts">
const props = defineProps<{
	error?: string,                     // The error message.
}>();
</script>

<template>
	<em v-if="props.error !== undefined">{{ props.error }}</em>
</template>

<style scoped>
em {
	display:          flex;
	height:           2rem;
	align-items:      center;

	margin-top:       0.25rem;
	margin-bottom:    1rem;

	padding-left:     0.5rem;
	padding-right:    0.5rem;

	border-radius:    5px;

	font-style:       normal;
	font-size:        0.9rem;

	color:            var(--col-accent-red);
	background-color: rgba(180, 0, 0, 0.15);
}

em:empty {
	background-color: transparent;
}
</style>