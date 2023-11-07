<script setup lang="ts">
import ViewHeader from '@/components/admin/ViewHeader.vue';
import { ref } from 'vue';
import fetchModelArray from '@/api/fetchModelArray';

const teams = ref<[]>([]);
const users = ref<[]>([]);

fetchModelArray('teams').then((res) => teams.value = res);
fetchModelArray('users').then((res) => users.value = res);
</script>

<template>
	<ViewHeader>Admin Dashboard</ViewHeader>
	<div class="panels">
		<div class="info-panel">
			<span>Registered Teams</span>
			<span class="number">{{ teams.length }}</span>
		</div>
		<div class="info-panel">
			<span>Registered Users</span>
			<span class="number">{{ users.length }}</span>
		</div>
	</div>

</template>

<style scoped>
.panels {
	width:          90%;

	display:        flex;
	flex-direction: column;
	align-items:    center;

	row-gap:        1rem;
}

.info-panel {
	width:         100%;

	border:        solid 2px var(--col-body-dark-200);
	border-radius: 6px;

	padding:       1rem;

	display:       flex;
	align-items:   center;
}

.info-panel .number {
	font-size:  3rem;
	flex:       1;
	text-align: right;
}
</style>