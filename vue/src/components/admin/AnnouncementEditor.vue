<script setup lang="ts">
import { ref } from 'vue';

import feather from 'feather-icons';
import fetchData from '@/api/fetchData';

import IconButton from '@/components/buttons/IconButton.vue';
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import UploadButton from '@/components/buttons/UploadButton.vue';
import EditButton from '@/components/buttons/EditButton.vue';

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
		.then((response) =>
		{
			/* This should practically never show; however, in case there is an error this
			 * acts as a fallback to give some sort of user feedback.
			 */
			if (response.hasOwnProperty('success') || response['success'] === false)
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
		.then((response) =>
		{
			/* This should practically never show; however, in case there is an error this
			 * acts as a fallback to give some sort of user feedback.
			 */
			if (response.hasOwnProperty('success') || response['success'] === false)
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
			<div class="footer__buttons">
				<EditButton v-if="!currentlyEditing" @click="toggleEditState"/>
				<IconButton v-else @click="toggleEditState" :icon="feather.icons['arrow-left']"/>

				<DeleteButton v-if="!currentlyEditing" @click="deleteAnnouncement"/>
				<UploadButton v-else @click="updateAnnouncement"/>
			</div>
		</div>
	</form>
</template>

<style scoped>
form {
	width:          90%;

	display:        flex;
	flex-direction: column;

	padding-top:    0.85rem;

	border-bottom:  thin solid var(--col-body-dark-200);
}

textarea {
	width:            100%;
	min-height:       11rem;
	resize:           none;

	padding:          0.5rem;
	background-color: transparent;
	color:            var(--col-text-dark);

	border: thin solid currentColor;
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
	display:               grid;
	grid-template-columns: 1fr;
	align-items:           center;
	justify-content:       center;

	margin-top:            0.15rem;
	margin-bottom:         1rem;
}

.footer__buttons {
	display:         flex;
	justify-content: end;
	column-gap:      1rem;
}
</style>