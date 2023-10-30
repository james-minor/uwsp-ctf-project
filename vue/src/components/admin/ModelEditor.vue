<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import EditorControlGroup from '@/components/admin/EditorControlGroup.vue';
import FormInput from '@/components/form/FormInput.vue';
import type { FeatherIcon } from 'feather-icons';
import FormTextArea from '@/components/FormTextArea.vue';
import FormDateTime from '@/components/form/FormDateTime.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import { FieldType } from '@/enum/FieldType';
import type { Field } from '@/types/Field';

const emit = defineEmits<{
	(e: 'refresh'): void,   // Event fired when the model data is updated.
}>();

const props = defineProps<{
	model: string,      // The model name the editor is modeling. Example: 'user'.
	id: number,         // The ID of the model within the database table.
	fields: Field[],    // Array to hold the initial state for the visible fields for the model.
}>();

const editedFields = ref<Field[]>(props.fields);

const editMode = ref<boolean>(false);  // Is the editor currently in edit mode?

/* Resets any edited field values to their initial state.
 */
function resetEditedFields()
{
	for (let i = 0; i < editedFields.value.length; i++)
	{
		editedFields.value[i].modelValue = props.fields[i].initialValue;
	}
}

/* Handles going in and out of edit mode.
 */
function toggleEditMode()
{
	editMode.value = !editMode.value;

	/* If exiting edit mode, we reset the edited field values to their initial state.
	 */
	if (!editMode.value)
	{
		resetEditedFields();
	}
}

/* Handles the deletion of model data.
 */
async function deleteModel()
{
	await fetchData(`${props.model}/${props.id}`, 'DELETE')
		.then(async (response) =>
		{
			let json = await response.json();
			if (json['success'] !== true)
			{
				/* This should practically never show; however, in case there is an error this
				 * acts as a fallback to give some sort of user feedback. If this is showing in production, something
				 * is broken.
				 */
				resetEditedFields();
				alert(`Could not delete ${props.model} ID: ${props.id}`);
			}

			emit('refresh');
		});
}

/* Handles the updating of model data.
 */
function updateModel()
{
	/* Dynamically adding editable field current values to a body object to be sent to the API.
	 */
	let body: Record<string, any> = {};
	for (let i = 0; i < editedFields.value.length; i++)
	{
		if (editedFields.value[i].editable)
		{
			body[editedFields.value[i].name.toString()] = editedFields.value[i].modelValue;
		}
	}

	/* Sending data to the API.
	 */
	fetchData(`${props.model}/${props.id}`, 'PUT', body)
		.then(async (response) =>
		{
			let json = await response.json();
			if (json['success'] !== true)
			{
				resetEditedFields();
				alert(`Could not update ${props.model} ID: ${props.id}`);
			}

			editMode.value = false;
			emit('refresh');
		});
}

/* Returns true if the editor has any editable fields.
 */
function hasEditableFields(): boolean
{
	for (let i = 0; i < editedFields.value.length; i++)
	{
		if (editedFields.value[i].editable)
		{
			return true;
		}
	}

	return false;
}

resetEditedFields();  // Sets the initial value for the fields on template construction.
</script>

<template>
	<div class="editor">
		<div class="editor__fields">
			<div v-for="field in editedFields" :class="['field-wrapper', field.type]">
				<FormTextArea
					v-if="field.type === FieldType.TEXT_AREA"
					v-model="field.modelValue"

					:name="field.name"
					:max-length="field.maxLength"
					:disabled="(!field.editable || !editMode)"
				/>

				<FormInput
					v-if="field.type === FieldType.TEXT"
					type="text"

					v-model="field.modelValue"

					:icon="field.icon as FeatherIcon"
					:name="field.name"
					:max-length="field.maxLength"
					:disabled="(!field.editable || !editMode)"
				/>

				<FormDateTime
					v-if="field.type === FieldType.DATE"
					v-model="field.modelValue"

					:name="field.name"
					:disabled="(!field.editable || !editMode)"
				/>

				<FormSelect
					v-if="field.type === FieldType.SELECT"
					v-model="field.modelValue"

					:options="field.options ? field.options : []"
					:disabled="(!field.editable || !editMode)"
				/>
			</div>
		</div>

		<div class="editor__footer">
			<EditorControlGroup
				:currently-editing="editMode"
				:no-editable-fields="!hasEditableFields()"

				@toggle="toggleEditMode"
				@update="updateModel"
				@delete="deleteModel"
			/>
		</div>
	</div>
</template>

<style scoped>
.editor {
	width:          90%;

	display:        flex;
	flex-direction: column;

	row-gap:        1rem;
	padding:        1rem;

	border:         solid 2px var(--col-body-dark-200);
	border-radius:  6px;

	margin-top:     1rem;
	margin-bottom:  1rem;
}

.editor__fields {
	display:               grid;
	grid-template-columns: repeat(2, 1fr);
	grid-auto-rows:        min-content;

	grid-row-gap:          1rem;
	grid-column-gap:       1rem;

	width:                 100%;
}

.field-wrapper.text {
	width:       100%;
	grid-column: span 1;
}

.field-wrapper.text:only-of-type {
	grid-column: span 2;
}

.field-wrapper.textarea {
	width:       100%;
	grid-column: span 2;
}

.field-wrapper.date {
	width:       100%;
	grid-column: span 2;
}

.field-wrapper.select {
	width: 100%;
	grid-column: span 2;
}

.field-wrapper.text input {
	width: 100%;
}

.field-wrapper.textarea textarea {
	width:  100%;
	height: 5rem;
	resize: none;
}

.editor__footer {
	display:         flex;
	justify-content: end;
}

@media (prefers-color-scheme: light) {
	.editor {
		background-color: var(--col-body-light-100);
		box-shadow:       0 4px 4px 0 rgba(0, 0, 0, 0.45);
		border-color:     transparent;
	}
}
</style>