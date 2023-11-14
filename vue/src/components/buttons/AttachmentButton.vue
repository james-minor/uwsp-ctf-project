<script setup lang="ts">
import fetchData from '@/api/fetchData';

const props = defineProps<{
	attachmentId: number,
}>();

async function openAttachmentFile()
{
	await fetchData(`attachment/${props.attachmentId}`, 'GET')
		.then(res => res.blob())
		.then(blob =>
		{
			window.open(URL.createObjectURL(blob), '_blank');
		});
}
</script>

<template>
	<button
		@click="openAttachmentFile"
	>
		<slot></slot>
	</button>
</template>

<style scoped>
button {
	color: var(--col-text-dark);
	background-color: var(--col-main-purple);
	outline: none;
	border: none;

	padding: 0.5rem;
	width: 100%;

	border-radius: 8px;
}
</style>