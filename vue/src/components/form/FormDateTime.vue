<script setup lang="ts">

import { ref, watch } from 'vue';
import * as feather from 'feather-icons';
import dayjs, { Dayjs } from 'dayjs';
import FormInput from '@/components/FormInput.vue';

import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

const currentDate = ref<Dayjs>(dayjs());
const viewedDate = ref<Dayjs>(currentDate.value);

const popupVisible = ref<boolean>(false);

const currentDateString = ref<string>('');

const currentHour = ref<string>('0');
const currentMinute = ref<string>('0');

function getCalendarArray(date: Dayjs)
{
	const startDate = date.startOf('month');
	const daysInMonth = date.daysInMonth();

	type calendarCell = {
		date: Dayjs,
		dayOfMonth: number,
		dayOfYear: number,
		weekday: number,
	};

	let calendarArray: calendarCell[] = [];

	/* Generating the cells for the current month.
	 */
	for (let i = 0; i < daysInMonth; i++)
	{
		let cellDate = startDate.add(i, 'day');

		calendarArray.push({
			date: cellDate,
			dayOfMonth: cellDate.date(),
			dayOfYear: dayjs(cellDate).dayOfYear(),
			weekday: cellDate.day(),
		});
	}

	/* Generating the cells for the next month (if applicable).
	 */
	const emptyCellsInLastWeek: number = 6 - calendarArray[calendarArray.length - 1].weekday;
	for (let i = 0; i < emptyCellsInLastWeek; i++)
	{
		let cellDate = calendarArray[calendarArray.length - 1].date.add(1, 'day');

		calendarArray.push({
			date: cellDate,
			dayOfMonth: cellDate.date(),
			dayOfYear: dayjs(cellDate).dayOfYear(),
			weekday: cellDate.day(),
		});
	}

	/* Generating the cells for the previous month (if applicable).
	 */
	const emptyCellsInFirstWeek: number = calendarArray[0].weekday;
	for (let i = 0; i < emptyCellsInFirstWeek; i++)
	{
		let cellDate = calendarArray[0].date.subtract(1, 'day');

		calendarArray.unshift({
			date: cellDate,
			dayOfMonth: cellDate.date(),
			dayOfYear: dayjs(cellDate).dayOfYear(),
			weekday: cellDate.day(),
		});
	}

	return calendarArray;
}

function constructDateString()
{
	currentDateString.value = dayjs(currentDate.value)
		.hour(parseInt(currentHour.value === '' ? '0' : currentHour.value, 10))
		.minute(parseInt(currentMinute.value === '' ? '0' : currentMinute.value, 10))
		.second(0)
		.millisecond(0)
		.format();
}

function updateViewedDate()
{
	viewedDate.value = dayjs(currentDate.value);
}

function updateCurrentDateFromString()
{
	if (dayjs(currentDateString.value).isValid())
	{
		currentDate.value = dayjs(currentDateString.value);
		currentMinute.value = dayjs(currentDate.value).minute().toString();
		currentHour.value = dayjs(currentDate.value).hour().toString();

		updateViewedDate();
	}
}

getCalendarArray(currentDate.value);
constructDateString();

watch(currentHour, (newValue) =>
{
	if (newValue !== '' && !new RegExp('^[0-9]+$').test(newValue))
	{
		currentHour.value = '0';
	}
}, { flush: 'post' })

watch(currentMinute, (newValue) =>
{
	if (newValue !== '' && !new RegExp('^[0-9]+$').test(newValue))
	{
		currentMinute.value = '0';
	}
}, { flush: 'post' })

</script>

<template>
	<div class="datetime-container">
		<FormInput
			v-model="currentDateString"
			name="release-date"
			type="text"

			@click="popupVisible = true"
			@input="popupVisible = true; updateCurrentDateFromString()"
		/>
		<div
			role="button"
			v-html="feather.icons['calendar'].toSvg({})"
			class="toggle"

			@click="popupVisible = !popupVisible"
		/>
		<div class="popup-container" v-if="popupVisible">
			<div class="date-picker">
				<div class="date-picker__header">
					<div
						role="button"
						v-html="feather.icons['chevron-left'].toSvg()"

						class="date-picker__prev"

						@click="viewedDate = dayjs(viewedDate).subtract(1, 'month')"
					/>
					<span>
						{{ viewedDate.toDate().toLocaleString('default', { month: 'long' }) }}
						{{ viewedDate.year() }}
					</span>
					<div
						role="button"
						v-html="feather.icons['chevron-right'].toSvg()"

						class="date-picker__next"

						@click="viewedDate = dayjs(viewedDate).add(1, 'month')"
					/>
				</div>
				<div class="date-picker__weekdays">
					<span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']">{{ day }}</span>
				</div>
				<div class="date-picker__grid">
					<div
						v-for="date in getCalendarArray(viewedDate)"
						:class="{
							'date-picker__day': true,
							'date-picker__day--today': dayjs(date.date).dayOfYear() === dayjs(currentDate).dayOfYear(),
							'date-picker__day--diff-month': date.date.month() !== viewedDate.month(),
						}"
						:style="`grid-column: ${date.weekday + 1} / ${date.weekday + 2};`"

						@click="
							currentDate = dayjs(date.date).toDate();
							constructDateString();
							updateViewedDate();
						"
					>
						{{ date.dayOfMonth }}
					</div>
				</div>
			</div>
			<div class="time-picker">
				<FormInput
					v-model="currentHour"

					name="hour"
					type="text"
					:max-length="2"

					@input="constructDateString()"
				/>
				<FormInput
					v-model="currentMinute"

					name="minute"
					type="text"
					:max-length="2"

					@input="constructDateString()"
				/>
			</div>
		</div>
	</div>

</template>

<style scoped>
.datetime-container {
	position: relative;
	width:    100%;
}

input {
	position: relative;
}

.popup-container {
	position:         absolute;
	top:              calc(100% + 0.5rem);
	left:             50%;

	width:            min(40ch, 100%);

	transform:        translateX(-50%);

	align-self:       center;

	background-color: var(--col-body-dark-200);

	padding:          0.25rem;

	border-radius:    5px;
	border:           2px solid var(--col-body-dark-300);
}

.date-picker__header {
	display:         flex;
	align-items:     center;
	justify-content: center;

	height:          2.25rem;
}

.date-picker__header > span {
	flex:       2;
	text-align: center;
}

.date-picker__weekdays,
.date-picker__grid {
	display:               grid;
	grid-template-columns: repeat(7, 1fr);
	text-align:            center;
	align-items:           center;
	justify-content:       center;

	gap:                   0.4rem;
}

.date-picker__weekdays {
	height:      1.75rem;
	font-weight: bold;
}

.date-picker__day {
	aspect-ratio:    1;

	display:         flex;
	align-items:     center;
	justify-content: center;

	padding:         0.25rem;

	font-size:       0.9rem;
	font-family:     monospace;

	cursor:          pointer;

	border-radius:   5px;
	border:          2px solid transparent;
}

.date-picker__day--today {
	border-color: var(--col-main-purple);
}

.date-picker__day--diff-month {
	color: var(--col-body-dark-300);
}

.date-picker__day:hover {
	color:            var(--col-text-dark);
	background-color: var(--col-main-purple);
}

.time-picker {
	display:               grid;
	grid-template-columns: repeat(2, 1fr);

	padding:               0.5rem;

	align-items:           center;
	justify-content:       center;

	column-gap:            0.5rem;
	text-align:            center;
}

.toggle {
	position:  absolute;
	top:       50%;
	transform: translateY(-50%);
	right:     0.5rem;
	cursor:    pointer;
}

.date-picker__prev,
.date-picker__next {
	cursor: pointer;
}

@media (prefers-color-scheme: light) {
	.popup-container {
		color:            var(--col-text-light);
		background-color: var(--col-body-light-100);

		border-color:     var(--col-body-light-100);

		box-shadow:       0 0 10px 1px rgba(0, 0, 0, 0.3);
	}

	.date-picker__day--diff-month {
		color: var(--col-body-light-300);
	}
}

</style>