<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';

import EditorControlGroup from '@/components/admin/EditorControlGroup.vue';

const emit = defineEmits<{
	(e: 'update'): void,        // Event fired when the announcement data is updated.
	(e: 'delete'): void,        // Event fired when the announcement is deleted.
}>();

const props = defineProps<{
	id: number,                 // ID of the announcement in the announcements table.
	authorUsername: string,     // ID of the announcement's original author.
	body: string,               // The body text of the announcement.
	creationDate: string,       // The original creation date.
}>();

/* The locally-edited body text.
 */
const body = ref<string>(props.body);

/* Is the announcement data currently being edited?
 */
const currentlyEditing = ref<boolean>(false);

async function updateAnnouncement()
{
	await fetchData(`announcement/${props.id}`, 'PUT', { 'body': body.value.toString() })
		.then(async (response) =>
		{
			let json = await response.json();

			/* This should practically never show; however, in case there is an error this
			 * acts as a fallback to give some sort of user feedback.
			 */
			if (json['success'] === false)
			{
				alert('Could not update the event.');
			}

			currentlyEditing.value = false;
			emit('update');
		});
}

async function deleteAnnouncement()
{
	await fetchData(`announcement/${props.id}`, 'DELETE')
		.then(async (response) =>
		{
			let json = await response.json();

			/* This should practically never show; however, in case there is an error this
			 * acts as a fallback to give some sort of user feedback.
			 */
			if (json['success'] === false)
			{
				alert('Could not delete the event.');
			}

			emit('delete');
		});
}

function toggleEditState()
{
	currentlyEditing.value = !currentlyEditing.value;

	if (!currentlyEditing.value)
	{
		body.value = props.body;
	}
}
</script>

<template>
	<form>
		<div class="textarea__container">
			<textarea
				v-model="body"
				maxlength="1000"
				:disabled="!currentlyEditing"
			></textarea>
			<div class="character-count-container">
				<span class="character-count" v-show="currentlyEditing">{{ body.length }}/1000</span>
			</div>
		</div>

		<div class="footer">
			<EditorControlGroup
				:currently-editing="currentlyEditing"

				@toggle="toggleEditState"
				@update="updateAnnouncement"
				@delete="deleteAnnouncement"
			/>
		</div>
	</form>
</template>

<style scoped>
form {
	width:          90%;

	display:        flex;
	flex-direction: column;

	border-bottom:  thin solid var(--col-body-dark-200);
}

textarea {
	width:            100%;
	min-height:       11rem;
	resize:           none;

	padding:          0.5rem;
	background-color: transparent;
	color:            var(--col-text-dark);

	border:           thin solid currentColor;
	border-radius:    5px;
}

textarea:disabled {
	border-color: transparent;
}

.character-count-container {
	height: 0.85rem;
}

.character-count {
	display:     block;
	font-size:   0.85rem;
	font-family: monospace;;
}

.footer {
	display:         flex;
	align-items:     end;
	justify-content: end;

	margin-top:      0.15rem;
	margin-bottom:   1rem;
}
</style>