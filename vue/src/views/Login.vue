<script setup lang="ts">
import * as feather from 'feather-icons';
import { ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import router from '@/router/router';
import { useSessionStore } from '@/stores/session';
import fetchData from '@/api/fetchData';
import AppButton from '@/components/buttons/AppButton.vue';

const formData = ref({
	email: '',
	password: '',
});

const formErrors = ref({
	email: '',
	password: '',
});

const formValid = ref<boolean>(false);

const sessionStore = useSessionStore();

async function onFormSubmit()
{
	await fetchData('session', 'POST', { email: formData.value.email, password: formData.value.password })
		.then((res) =>
		{
			return res.json();
		})
		.then((res) =>
		{
			if (res.success)
			{
				if ('session' in res.data && 'admin' in res.data)
				{
					sessionStore.login(res.data.session, res.data.admin);
					router.push({ path: '/challenges' });
				}
			}
			else
			{
				formErrors.value.email = res.errors.filter((error: any) =>
				{
					return error.key === 'email';
				})[0].message;

				formErrors.value.password = res.errors.filter((error: any) =>
				{
					return error.key === 'password';
				})[0].message;
			}
		});
}

function validateForm()
{
	formValid.value = true;

	/* Lazily validating email.
	 */
	if (formData.value.email.length < 5 || formData.value.email.length > 75)
	{
		formValid.value = false;
	}

	if (!(formData.value.email.includes('@') && formData.value.email.includes('.')))
	{
		formValid.value = false;
	}

	/* Validating password.
	 */
	if (formData.value.password.length < 10)
	{
		formValid.value = false;
	}
}

</script>

<template>
	<div class="view">
		<form method="post" @submit.prevent="onFormSubmit">
			<h1>Welcome Back</h1>
			<p>Ready to start another challenge?</p>

			<FormInput
				name="email"
				type="email"
				v-model="formData.email"
				:icon="feather.icons.mail"
				:error="formErrors.email"

				@input="validateForm"
			/>
			<FormInput
				name="password"
				type="password"
				v-model="formData.password"
				:icon="feather.icons.lock"
				:error="formErrors.password"

				@input="validateForm"
			/>

			<AppButton :disabled="!formValid" @click.prevent="onFormSubmit">Login</AppButton>

			<router-link to="/register">Create a new account</router-link>
		</form>
	</div>
</template>

<style scoped>
.view {
	min-height:       100svh;
	width:            100%;

	background-image: url("/full-screen-background.svg");

	display:          flex;
	align-items:      center;
	justify-content:  center;

	box-shadow:       inset 0 0 25vw 20px var(--col-main-purple);
}

form {
	display:            flex;
	flex-direction:     column;

	background-color:   var(--col-body-light-100);
	color:              var(--col-text-light);
	padding:            2.5rem;

	border-radius:      10px;
	min-width:          min(45ch, 95%);

	box-shadow:         0 0 10px 2px rgba(0, 0, 0, 0.5);
	-webkit-box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.5);
	-moz-box-shadow:    0 0 10px 2px rgba(0, 0, 0, 0.5);
}

h1,
p {
	text-align: center;
}

p {
	margin-bottom: 2rem;
}

a {
	margin-top: 1rem;
	text-align: center;
}
</style>