<script setup lang="ts">
import { ref } from 'vue';

import feather from 'feather-icons';
import fetchData from '@/api/fetchData';

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
			// TODO: make sure response is successful.
			currentlyEditing.value = false;

			emit('update');
		});
}

async function deleteAnnouncement()
{
	await fetchData(`announcement/${props.id}`, 'DELETE')
		.then((response) =>
		{
			// TODO: make sure response is successful.
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
		<textarea
			v-model="body"
			maxlength="1000"
			:disabled="!currentlyEditing"
		></textarea>
		<div class="character-count">
			<span v-show="currentlyEditing">{{ body.length }}/1000</span>
		</div>

		<div class="button-container">
			<button @click="toggleEditState" type="button">
				<i v-if="currentlyEditing" v-html="feather.icons['arrow-left'].toSvg({ stroke: 'white' })"/>
				<i v-else v-html="feather.icons['edit'].toSvg({ stroke: 'white' })"/>
			</button>

			<button v-if="!currentlyEditing" @click="deleteAnnouncement" type="button">
				<i v-html="feather.icons['trash'].toSvg({ stroke: 'white' })"/>
			</button>

			<button v-else @click="updateAnnouncement" type="button">
				<i v-html="feather.icons['upload'].toSvg({ stroke: 'white' })"/>
			</button>
		</div>

		<hr>
	</form>

</template>

<style scoped>
form {
	width:          90%;

	display:        flex;
	flex-direction: column;

	padding-top:    0.85rem;
}

hr {
	margin-top: 1rem;
	height: 1px;
	margin-bottom: 1rem;
	opacity: 0.06;
	width: 90%;
	align-self: center;

	border: none;
	background-color: var(--col-text-dark);
}

textarea {
	resize:           none;

	padding:          0.5rem;
	background-color: transparent;
	color:            var(--col-text-dark);

	border-style: solid;
	border-width: thin;
	border-color: currentColor;
	border-radius: 5px;
}

textarea:disabled {
	border-color: transparent;
}

.character-count {
	height:  0.85rem;
	opacity: 0.5;
}

.character-count > span {
	font-size:   0.85rem;
	font-family: monospace;
}

button {
	display:          flex;
	align-items:      center;
	justify-content:  center;

	aspect-ratio:     1;

	background-color: transparent;

	cursor:           pointer;

	border-width: thin;
	border-style: solid;
	border-radius:    5px;

	padding:          0.65rem;
}

.button-container {
	align-self:      end;

	display:         flex;
	align-items:     center;
	justify-content: center;
	column-gap:      1rem;

	padding-bottom:  0.85rem;
}
</style>