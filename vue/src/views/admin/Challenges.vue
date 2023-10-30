<script setup lang="ts">
import ViewHeader from '@/components/admin/ViewHeader.vue';
import fetchData from '@/api/fetchData';
import { ref } from 'vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import { FieldType } from '@/enum/FieldType';
import type { SelectOption } from '@/types/SelectOption';

const challenges = ref<[]>([]);
const categoryOptionsArray = ref<SelectOption[]>([]);
const waveOptionsArray = ref<SelectOption[]>([]);

async function fetchChallenges()
{
	await fetchData('challenges', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			challenges.value = json.data['challenges'];
		});
}

async function fetchCategories()
{
	await fetchData('categories', 'GET')
		.then(async (response) =>
		{
			let categories = (await response.json()).data['categories'];

			for (let category of categories)
			{
				categoryOptionsArray.value.push({
					value: category['id'],
					text: category['title'],
				});
			}
		});
}

async function fetchWaves()
{
	await fetchData('waves', 'GET')
		.then(async (response) =>
		{
			let waves = (await response.json()).data['waves'];

			for (let wave of waves)
			{
				waveOptionsArray.value.push({
					value: wave['id'],
					text: wave['releaseDate'],
				});
			}
		});
}

fetchChallenges();
fetchCategories();
fetchWaves();
</script>

<template>
	<ViewHeader>Manage Challenges</ViewHeader>

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
				initialValue: challenge['value'],
				modelValue: challenge['value'],
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
				initialValue: challenge['waveId'],
				modelValue: challenge['waveId'],
				options: waveOptionsArray,
			},
			{
				name: 'categoryId',
				type: FieldType.SELECT,
				editable: true,
				initialValue: challenge['categoryId'],
				modelValue: challenge['categoryId'],
				options: categoryOptionsArray,
			}
		]"

		@refresh="fetchChallenges"
	/>
</template>

<style scoped>

</style>