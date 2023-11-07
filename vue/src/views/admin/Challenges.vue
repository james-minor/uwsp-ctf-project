<script setup lang="ts">
import ViewHeader from '@/components/admin/ViewHeader.vue';
import { ref } from 'vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import { FieldType } from '@/enum/FieldType';
import type { SelectOption } from '@/types/SelectOption';
import fetchModelArray from '@/api/fetchModelArray';
import FormInput from '@/components/form/FormInput.vue';
import fetchData from '@/api/fetchData';
import AppButton from '@/components/buttons/AppButton.vue';
import FormTextArea from '@/components/form/FormTextArea.vue';
import FormSelect from '@/components/form/FormSelect.vue';

const challenges = ref<[]>([]);
const categoryOptionsArray = ref<SelectOption[]>([]);
const waveOptionsArray = ref<SelectOption[]>([]);

const newChallengeData = ref<{
	title: string,
	value: string,
	body: string,
	flag: string,
	waveId: string,
	categoryId: string,
}>({
	title: '',
	value: '',
	body: '',
	flag: '',
	waveId: '',
	categoryId: '',
});

async function postChallenge()
{
	await fetchData('challenges', 'POST', newChallengeData.value)
		.then(async (response) =>
		{
			// TODO: maybe make sure it posted correctly, popup some sort of error if it didnt?
		});

	await fetchChallenges();
}

async function fetchChallenges()
{
	challenges.value = await fetchModelArray('challenges');
}

async function fetchCategories()
{
	let categories = await fetchModelArray('categories');
	for (let category of categories)
	{
		categoryOptionsArray.value.push({
			value: category['id'].toString(),
			text: category['title'],
		});
	}
}

async function fetchWaves()
{
	let waves = await fetchModelArray('waves');
	for (let wave of waves)
	{
		waveOptionsArray.value.push({
			value: wave['id'].toString(),
			text: wave['releaseDate'],
		});
	}
}

fetchChallenges();
fetchCategories();
fetchWaves();
</script>

<template>
	<ViewHeader>Manage Challenges</ViewHeader>

	<form>
		<FormInput type="text" name="challenge-title" :max-length="30" v-model="newChallengeData.title"/>
		<FormInput type="text" name="challenge-value" :max-length="10" v-model="newChallengeData.value"/>
		<FormTextArea name="challenge-body" :max-length="750" v-model="newChallengeData.body"/>
		<FormInput type="text" name="challenge-flag" :max-length="50" v-model="newChallengeData.flag"/>
		<FormSelect name="challenge-category" :options="categoryOptionsArray" v-model="newChallengeData.categoryId"/>
		<FormSelect name="challenge-wave" :options="waveOptionsArray" v-model="newChallengeData.waveId"/>

		<AppButton @click.prevent="postChallenge">POST</AppButton>
	</form>

	<ModelEditor
		v-if="challenges.length > 0"
		v-for="challenge in challenges"
		model="challenge"

		:key="challenge['id']"
		:id="challenge['id']"
		:fields="[
			{
				name: 'title',
				type: FieldType.TEXT,
				editable: true,
				initialValue: challenge['title'],
				modelValue: challenge['title'],
				maxLength: 30,
			},
			{
				name: 'value',
				type: FieldType.TEXT,
				editable: true,
				initialValue: String(challenge['value']),
				modelValue: String(challenge['value']),
			},
			{
				name: 'body',
				type: FieldType.TEXT_AREA,
				editable: true,
				initialValue: challenge['body'],
				modelValue: challenge['body'],
				maxLength: 750,
			},
			{
				name: 'flag',
				type: FieldType.TEXT,
				editable: true,
				initialValue: challenge['flag'],
				modelValue: challenge['flag'],
			},
			{
				name: 'waveId',
				type: FieldType.SELECT,
				editable: true,
				initialValue: String(challenge['waveId']),
				modelValue: String(challenge['waveId']),
				options: waveOptionsArray,
			},
			{
				name: 'categoryId',
				type: FieldType.SELECT,
				editable: true,
				initialValue: String(challenge['challengeId']),
				modelValue: String(challenge['challengeId']),
				options: categoryOptionsArray,
			}
		]"

		@refresh="fetchChallenges"
	/>
</template>

<style scoped>
form {
	display:        flex;
	flex-direction: column;
	width:          90%;

	row-gap: 0.25rem;

	margin-bottom:  2rem;
}
</style>