<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import { useAnnouncementStore } from '@/stores/announcement';
import AppButton from '@/components/buttons/AppButton.vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import ViewHeader from '@/components/admin/ViewHeader.vue';
import EmptyListFooter from '@/components/admin/EmptyListFooter.vue';
import { FieldType } from '@/enum/FieldType';
import FormTextArea from '@/components/form/FormTextArea.vue';

const announcementStore = useAnnouncementStore();

const announcementBody = ref<string>('');

async function postAnnouncement()
{
	await fetchData('announcements', 'POST', { body: announcementBody.value })
		.then(async () =>
		{
			// TODO: maybe make sure it posted correctly, popup some sort of error if it didnt?
		});

	announcementBody.value = '';
	await announcementStore.fetchAnnouncements();
}
</script>

<template>
	<ViewHeader>Manage Announcements</ViewHeader>
	<form>
		<FormTextArea
			v-model="announcementBody"
			name="body"
			:max-length="1000"
		/>
		<div class="character-count">
			<span>{{ announcementBody.length }}/1000</span>
		</div>

		<AppButton class="post" :disabled="announcementBody.length === 0" @click="postAnnouncement">POST</AppButton>
	</form>

	<ModelEditor
		v-if="announcementStore.announcements.length > 0"
		v-for="announcement in announcementStore.announcements"
		model="announcement"

		:key="announcement['id']"
		:id="announcement['id']"
		:fields="[
			{
				name: 'body',
				type: FieldType.TEXT_AREA,
				editable: true,
				initialValue: announcement['body'],
				modelValue: announcement['body']
			}
		]"

		@refresh="announcementStore.fetchAnnouncements()"
	/>

	<EmptyListFooter v-else>No Posted Announcements</EmptyListFooter>
</template>

<style scoped>
form {
	display:        flex;
	flex-direction: column;
	width:          90%;

	margin-bottom:  2rem;
}

textarea {
	resize:           none;

	padding:          0.5rem;
	background-color: transparent;
	color:            var(--col-text-dark);

	border:           thin solid currentColor;
	border-radius:    5px;

	height:           10rem;
	width:            100%;
}

.character-count {
	height: 0.85rem;
}

.character-count > span {
	font-size:   0.85rem;
	font-family: monospace;
}

.post {
	align-self: end;
}
</style>