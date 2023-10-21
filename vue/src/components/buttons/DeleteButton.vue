<script setup lang="ts">
import IconButton from '@/components/buttons/IconButton.vue';
import feather from 'feather-icons';
</script>

<template>
	<IconButton :icon="feather.icons['trash']" @click="$emit('click')" />
</template>

<style scoped>

</style>