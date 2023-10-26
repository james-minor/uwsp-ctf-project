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
	currentlyEditing: boolean,      // Is the button group currently in edit mode?
	noEditableFields?: boolean,     // Does the editor have any editable fields? If not this hides the edit button.
}>();

</script>

<template>
	<div class="editor-controls">
		<div v-if="noEditableFields === false">
			<EditButton v-if="!currentlyEditing" @click="emit('toggle')"/>
			<AppButton v-else @click="emit('toggle')" :icon="feather.icons['arrow-left']"/>
		</div>

		<DeleteButton v-if="!currentlyEditing" @click="emit('delete')"/>
		<UploadButton v-else @click="emit('update')"/>
	</div>
</template>

<style scoped>
	.editor-controls {
		display: flex;
		column-gap: 1rem;
	}
</style>