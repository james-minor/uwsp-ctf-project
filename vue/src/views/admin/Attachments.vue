<script setup lang="ts">
import ViewHeader from '@/components/admin/ViewHeader.vue';
import { ref } from 'vue';
import FormInput from '@/components/form/FormInput.vue';
import { apiBaseURL } from '@/APIBaseURL';
import { useSessionStore } from '@/stores/session';
import type { SelectOption } from '@/types/SelectOption';
import fetchModelArray from '@/api/fetchModelArray';
import FormSelect from '@/components/form/FormSelect.vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import { FieldType } from '@/enum/FieldType';
import AppButton from '@/components/buttons/AppButton.vue';
import getSelectOptionsArray from '@/util/getSelectOptionsArray';
import fetchData from '@/api/fetchData';

const sessionStore = useSessionStore();

const newAttachmentData = ref<{
	title: string,
	challengeId: string,
	file: File | undefined,
}>({
	title: '',
	challengeId: '',
	file: undefined,
});

function updateAttachmentFile(event: Event)
{
	const target = event.target as HTMLInputElement;

	if (target.files instanceof FileList)
	{
		newAttachmentData.value.file = target.files[0];
	}
}

async function postAttachment()
{
	if (newAttachmentData.value.file === undefined)
	{
		return;
	}

	const form = new FormData();
	form.append('challengeId', newAttachmentData.value.challengeId);
	form.append('title', newAttachmentData.value.title);
	form.append('file', newAttachmentData.value.file);

	await fetch(`${apiBaseURL}/v1/attachments`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${sessionStore.session}`,
		},
		body: form,
	});

	newAttachmentData.value.title = '';
	newAttachmentData.value.file = undefined;

	fetchAttachments();
}

const challengeOptionsArray = ref<SelectOption[]>([]);

async function fetchChallenges()
{
	challengeOptionsArray.value = await getSelectOptionsArray('challenges', 'id', 'title');
	if (challengeOptionsArray.value.length > 0)
	{
		newAttachmentData.value.challengeId = challengeOptionsArray.value[0].value;
	}
}

const attachments = ref<[]>([]);

async function fetchAttachments()
{
	attachments.value = await fetchModelArray('attachments');
}

async function openAttachmentFile(id: number)
{
	await fetchData(`attachment/${id}`, 'GET')
		.then(res => res.blob())
		.then(blob =>
		{
			window.open(URL.createObjectURL(blob), '_blank');
		});
}

fetchChallenges();
fetchAttachments();
</script>

<template>
	<ViewHeader>Manage Attachments</ViewHeader>

	<form>
		<FormInput
			v-model="newAttachmentData.title"

			name="title"
			type="text"
		/>
		<input
			type="file"
			accept="text/csv, audio/mpeg, video/mp4, application/pdf, image/jpeg, image/png"
			@change="updateAttachmentFile"/>
		<FormSelect
			v-model="newAttachmentData.challengeId"
			name="ChallengeId"
			:options="challengeOptionsArray"
		/>

		<AppButton
			@click.prevent="postAttachment"
			:disabled="newAttachmentData.title === '' || newAttachmentData.file === undefined || newAttachmentData.challengeId === ''"
		>POST
		</AppButton>
	</form>

	<ModelEditor
		v-if="attachments.length > 0"
		v-for="attachment in attachments"
		model="attachment"

		:key="attachment['id']"
		:id="attachment['id']"
		:fields="[
			{
				name: 'title',
				type: FieldType.TEXT,
				editable: true,
				initialValue: attachment['title'],
				modelValue: attachment['title'],
				maxLength: 30,
			},
			{
				name: 'challengeId',
				type: FieldType.SELECT,
				editable: true,
				initialValue: String(attachment['challengeId']),
				modelValue: String(attachment['challengeId']),
				options: challengeOptionsArray,
			},
		]"

		@refresh="fetchAttachments"
	>
		<AppButton @click="openAttachmentFile(attachment['id'])" >View</AppButton>
	</ModelEditor>
</template>

<style scoped>

</style>