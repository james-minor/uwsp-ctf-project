<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import AppButton from '@/components/buttons/AppButton.vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import ViewHeader from '@/components/admin/ViewHeader.vue';
import EmptyListFooter from '@/components/admin/EmptyListFooter.vue';
import FormInput from '@/components/form/FormInput.vue';
import { FieldType } from '@/enum/FieldType';

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

fetchCategories();
</script>

<template>
	<ViewHeader>Manage Categories</ViewHeader>

	<form>
		<FormInput type="text" name="category-title" :max-length="15" v-model="newCategoryTitle"/>
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
				type: FieldType.TEXT,
				editable: true,
				initialValue: category['title'],
				modelValue: category['title'],
				maxLength: 15,
			}
		]"

		@refresh="fetchCategories"
	/>

	<EmptyListFooter v-else>No Posted Categories</EmptyListFooter>
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