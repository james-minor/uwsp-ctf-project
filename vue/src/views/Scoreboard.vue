<script setup lang="ts">   
import fetchData from '@/api/fetchData';
import { ref } from 'vue';

const captures = ref<any>([]);

const scores = ref<{
	name: string,
	score: number,
	captures: number,
}[]>([]);

async function fetchCaptures()
{
	await fetchData('captures', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			captures.value = json.data['captures'];
			calculateScores();
		});
}


function calculateScores()
{
	/* Calculating the team scores.
	 */
	for (let i = 0; i < captures.value.length; i++)
	{
		const teamName = captures.value[i]['team']['name'];
		const captureValue = captures.value[i]['challenge']['value'];

		const teamIndex = findTeamIndex(teamName);

		if (teamIndex >= 0)
		{
			scores.value[teamIndex].score += captureValue;
			scores.value[teamIndex].captures++;
		}
		else
		{
			scores.value.push({ name: teamName, score: captureValue, captures: 1 });
		}
	}

	/* Sorting the scores by point value.
	 */
	scores.value.sort(function(a, b)
	{
		return b.score - a.score;
	});

	/* Finds the index of a passed team name in the scores array, returns -1 if not found.
	 */
	function findTeamIndex(name: string): number
	{
		for (let i = 0; i < scores.value.length; i++)
		{
			if (scores.value[i].name === name)
			{
				return i;
			}
		}

		return -1;
	}
}

fetchCaptures();
</script>

<template>
	<table>
		<tr>
			<th>Position</th>
			<th>Team</th>
			<th>Captures</th>
			<th>Score</th>
		</tr>
		<tr v-for="(score, index) in scores">
			<td>{{ index + 1 }}</td>
			<td>{{ score.name }}</td>
			<td>{{ score.captures }}</td>
			<td>{{ score.score }}</td>
		</tr>
	</table>
</template>

<style scoped> 
table {
	margin: 1rem;
	width: 98%;
	table-layout: fixed;
	border-collapse: collapse;

	border: solid thin var(--col-body-dark-200);
}

tr {
	border-bottom: dashed thin var(--col-body-dark-200);
}

th {
	border-bottom: solid thin var(--col-body-dark-200);
}

th,
td {
	padding: 1rem;
	border-right: solid thin var(--col-body-dark-200);
}

td {
	border-right: solid thin var(--col-body-dark-200);
}

td:nth-child(1) {
	text-align: center;
}

th:nth-child(2) {
	width: 50%;
}

td:nth-child(3) {
	text-align: center;
}

td:last-of-type {
	text-align: right;
}
</style>