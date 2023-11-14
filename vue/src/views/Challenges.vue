<script setup lang="ts">

import fetchData from '@/api/fetchData';

import { ref } from 'vue';
import fetchModelArray from '@/api/fetchModelArray';
import ChallengeDropdown from '@/components/ChallengeDropdown.vue';
import AppButton from '@/components/buttons/AppButton.vue';
import AttachmentButton from '@/components/buttons/AttachmentButton.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormError from '@/components/form/FormError.vue';
import { useSessionStore } from '@/stores/session';

const sessionStore = useSessionStore();

const flagData = ref<{
	value: string,
	error: string | undefined,
}>({
	value: '',
	error: undefined,
});

const categories = ref<[]>([]);
const challenges = ref<[]>([]);
const selected = ref<any>(undefined);

const flagString = ref<string>('');

fetchModelArray('categories').then((res) => categories.value = res);
fetchModelArray('challenges').then((res) => challenges.value = res);

function getChallengeInCategory(categoryId: number): object[]
{
	let output: any[] = [];
	for (let challenge of challenges.value)
	{
		if (challenge['category']['id'] === categoryId)
		{
			output.push(challenge);
		}
	}

	return output;
}

function onSelectChallenge(challengeId: number)
{
	for (let challenge of challenges.value)
	{
		if (challenge['id'] === challengeId)
		{
			selected.value = challenge;

			if (sessionStore.hasElevatedPrivileges)
			{
				flagString.value = String(selected.value['flag']);
			}
		}
	}
}

async function attemptSolve()
{
	await fetchData(`challenge/${selected.value['id']}/solve`, 'POST', { flag: flagData.value.value })
		.then(async (res) =>
		{
			const json = await res.json();

			if (!json['errors'])
			{
				return;
			}

			flagData.value.error = json['errors'].filter((error: any) =>
			{
				return error.key === 'flag';
			})[0].message;
		});
}


</script>

<template>
	<div class="challenge-view">
		<div :class="{'challenge-list': true, 'challenge-list--empty': challenges.length === 0}">
			<ChallengeDropdown
				v-for="category in categories"
				v-if="categories.length > 0"

				:category-title="category['title']"
				:challenges="getChallengeInCategory(category['id'])"

				@select="onSelectChallenge"
			/>
			<span v-else>No Challenges are Released</span>
		</div>
		<div class="challenge-preview">
			<div class="challenge-preview__content" v-if="selected">
				<h2>{{ selected['title'] }}</h2>
				<p>{{ selected['body'] }}</p>

				<p v-if="!sessionStore.hasElevatedPrivileges && new Date(selected['wave']['releaseDate']) > new Date()">
					This challenge will unlock at {{ selected['wave']['releaseDate'] }}.
				</p>

				<AttachmentButton
					v-for="attachment in selected['attachments']"
					:attachment-id="attachment['id']"
				>{{ attachment['title'] }}
				</AttachmentButton>

				<FormInput
					v-if="sessionStore.session && !sessionStore.hasElevatedPrivileges"

					v-model="flagData.value"
					name="flag"
					type="text"
				/>
				<FormInput
					v-if="sessionStore.hasElevatedPrivileges"

					v-model="flagString"
					name="flag"
					type="text"

					:disabled="true"
				/>
				<FormError :error="flagData.error"></FormError>
				<AppButton
					v-if="!sessionStore.hasElevatedPrivileges && sessionStore.session"
					@click="attemptSolve"
				>
					Solve
				</AppButton>
			</div>
			<span v-else>Select a Challenge</span>
		</div>
	</div>
</template>

<style scoped>
.challenge-view {
	width:                 100%;
	flex:                  1;

	display:               grid;
	grid-template-columns: repeat(2, 1fr);
}

.challenge-list {
	width:           100%;

	border-right:    solid 2px var(--col-body-dark-200);
}

.challenge-list--empty {
	display:         flex;
	flex-direction:  column;

	align-items:     center;
	justify-content: center;
}

.challenge-preview {
	width:           100%;
	height:          100%;

	display:         flex;
	align-items:     center;
	justify-content: center;
}

.challenge-preview__content {
	margin:          1rem min(10%, 6rem);
	width:           100%;

	display:         flex;
	flex-direction:  column;
	justify-content: center;
	row-gap:         1rem;
}
</style>