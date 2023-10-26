<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import AppButton from '@/components/buttons/AppButton.vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';

const categories = ref<[]>([]);
const newCategoryTitle = ref<string>('');

async function fetchCategories()
{
	await fetchData('categories', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			categories.value = json.data['categories'];
		});
}
fetchCategories();

async function postCategory()
{
	await fetchData('categories', 'POST', { 'title': newCategoryTitle.value.toString() })
		.then(async (response) =>
		{
			// TODO: maybe make sure it posted correctly, popup some sort of error if it didnt?
		});

	newCategoryTitle.value = '';
	await fetchCategories();
}

</script>

<template>
	<h1>Manage Categories</h1>

	<form>
		<input type="text" maxlength="15" name="title" v-model="newCategoryTitle">
		<AppButton :disabled="newCategoryTitle.length === 0" @click="postCategory">POST</AppButton>
	</form>

	<ModelEditor
		v-if="categories.length > 0"
		v-for="category in categories"
		model="category"

		:key="category['id']"
		:id="category['id']"
		:fields="[
			{
				name: 'title',
				type: 'text',
				editable: true,
				initialValue: category['title'],
				modelValue: category['title'],
				maxLength: 15,
			}
		]"

		@refresh="fetchCategories"
	/>

	<span class="empty-list" v-else>No Posted Categories</span>
</template>

<style scoped>
h1 {
	align-self:    start;
	margin-left:   5%;
	margin-bottom: 1rem;
}

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
	flex: 1;
}
</style>