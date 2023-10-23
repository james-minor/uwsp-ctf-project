<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import EditorControlGroup from '@/components/admin/EditorControlGroup.vue';

const emit = defineEmits<{
	(e: 'refresh'): void,       // Event fired when the category data is updated.
}>();

const props = defineProps<{
	id: number,                 // ID of the category in the categories table.
	title: string,              // The category title.
}>();

/* The locally-edited category data.
 */
const categoryData = ref<{
	title: string,
}>({
	title: props.title,
});

/* Is the category data currently being edited?
 */
const currentlyEditing = ref<boolean>(false);

async function updateCategory()
{
	console.log(categoryData.value.title);
	console.log(categoryData.value.title.toString());

	fetchData(`category/${props.id}`, 'PUT', { 'title': categoryData.value.title.toString() })
		.then((response) =>
		{
			// TODO: validate response was a success.
			currentlyEditing.value = false;
			emit('refresh');
		});
}

async function deleteCategory()
{
	fetchData(`category/${props.id}`, 'DELETE')
		.then((response) =>
		{
			// TODO: validate response was a success.
			emit('refresh');
		});
}

function toggleEditState()
{
	currentlyEditing.value = !currentlyEditing.value;

	if (!currentlyEditing.value)
	{
		categoryData.value.title = props.title;
	}
}
</script>

<template>
	<form>
		<input type="text" maxlength="15" v-model="categoryData.title" :readonly="!currentlyEditing">


		<EditorControlGroup
			:currently-editing="currentlyEditing"

			@toggle="toggleEditState"
			@update="updateCategory"
			@delete="deleteCategory"
		/>
	</form>
</template>

<style scoped>
form {
	width:         90%;

	margin:        1rem 5%;

	border:        thin solid white;
	border-radius: 5px;

	display:       flex;
	align-items:   center;

	padding:       1rem;
	column-gap:    1rem;
}

input {
	flex:    1;
	padding: 0.25rem 0.5rem;
}

@media (prefers-color-scheme: light) {
	form {
		box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.45);
	}
}
</style>