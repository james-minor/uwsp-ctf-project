<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import ViewHeader from '@/components/admin/ViewHeader.vue';
import EmptyListFooter from '@/components/admin/EmptyListFooter.vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import AppButton from '@/components/buttons/AppButton.vue';
import FormInput from '@/components/FormInput.vue';

const waves = ref<[]>([]);
const newWaveReleaseDate = ref<string>('');

async function fetchWaves()
{
	await fetchData('waves', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			waves.value = json.data['waves'];
		});
}

async function postWave()
{
	await fetchData('waves', 'POST', { 'releaseDate': newWaveReleaseDate.value.toString() })
		.then(async (response) =>
		{
			// TODO: maybe make sure it posted correctly, popup some sort of error if it didnt?
		});

	newWaveReleaseDate.value = '';
	await fetchWaves();
}

fetchWaves();
</script>

<template>
	<ViewHeader>Manage Release Waves</ViewHeader>

	<form>
		<FormInput type="text" name="releaseDate" v-model="newWaveReleaseDate" />
		<AppButton :disabled="newWaveReleaseDate.length === 0" @click="postWave">POST</AppButton>
	</form>

	<ModelEditor
		v-if="waves.length > 0"
		v-for="wave in waves"
		model="wave"

		:id="wave['id']"
		:fields="[
			{
				name: 'releaseDate',
				type: 'text',
				editable: true,
				initialValue: wave['releaseDate'],
				modelValue: wave['releaseDate'],
			},
		]"

		@refresh="fetchWaves"
	/>

	<EmptyListFooter v-else>No Posted Waves</EmptyListFooter>
</template>

<style scoped>
form {
	width:         90%;

	margin-bottom: 2rem;

	border:        thin solid white;
	border-radius: 5px;

	display:       flex;
	align-items:   center;

	padding:       1rem;
	column-gap:    1rem;
}
</style>