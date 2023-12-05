<script setup lang="ts">

import { ref } from 'vue';
import AppButton from '@/components/buttons/AppButton.vue';

const test = ref(import.meta.env.VITE_API_URL);

</script>

<template>
	<div class="wrapper">
		<h1>Welcome to the Pointer Overflow CTF!</h1>

		<p>
			The University of Wisconsin - Stevens Point and the Department of Computing and New Media Technologies happily
			welcomes you to the Pointer Overflow CTF. This contest is a challenge of ingenuity and skill brought to you in
			honor of our incredible students and alumni.
		</p>
		<p>
			Feel free to register and participate! The contest is free, open to one and all, and runs in the Fall semesters.
			This year's contest is the second annual, and will run from September 17th, 2023 to January 21st, 2024
		</p>
		<p>
			This year we are happy to offer a first-place prize in the form of a $200.00 gift card to Hak5, NewEgg, or
			Amazon - winner's choice.
		</p>

		<div class="button-container">
			<router-link to="/login">
				<AppButton>Login</AppButton>
			</router-link>
			<router-link to="/register">
				<AppButton>Register</AppButton>
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	margin-top: 20vh;

	padding-left: 5ch;
	padding-right: 5ch;

	width: 100%;
}

h1,
p {
	text-align: left;
}

h1 {
	margin-bottom: 1rem;
}

p {
	margin-bottom: 1rem;
	max-width: 85ch;
}

.button-container {
	display: flex;
	flex-direction: row;
	gap: 1rem;
}

button {
	padding-left: 2rem;
	padding-right: 2rem;
}
</style>