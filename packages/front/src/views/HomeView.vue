<script setup lang="ts">
</script>

<template>
  <main class="flex h-screen items-center">
    <div class="w-full text-center">
      <Button icon="pi pi-camera" rounded aria-label="Take picture" fluid class="!p-16" :pt="{icon:{class:'!text-4xl'}}"/>
      <div class="pt-4 mx-auto font-semibold text-xl text-gray-400">Tap to scan</div>
    </div>
  </main>
</template>
