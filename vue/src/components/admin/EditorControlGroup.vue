<script setup lang="ts">
import feather from 'feather-icons';
import AppButton from '@/components/buttons/AppButton.vue';
import EditButton from '@/components/buttons/EditButton.vue';
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import UploadButton from '@/components/buttons/UploadButton.vue';

const emit = defineEmits<{
	(e: 'toggle'): void,        // Event fired when the button state is toggled.
	(e: 'update'): void,        // Event fired when the update button is pressed.
	(e: 'delete'): void,        // Event fired when the delete button is pressed.
}>();

defineProps<{
	currentlyEditing: boolean,  // Is the button group currently in edit mode?
}>();

</script>

<template>
	<div>
		<EditButton v-if="!currentlyEditing" @click="emit('toggle')"/>
		<AppButton v-else @click="emit('toggle')" :icon="feather.icons['arrow-left']"/>

		<DeleteButton v-if="!currentlyEditing" @click="emit('delete')"/>
		<UploadButton v-else @click="emit('update')"/>
	</div>
</template>

<style scoped>
	div {
		display: flex;
		column-gap: 1rem;
	}
</style>