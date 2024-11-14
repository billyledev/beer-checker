<script lang="ts" setup>
  import { ref } from 'vue';

  const products = ref([
    {
      id: 'product1',
      image: {
        src: 'https://picsum.photos/seed/123/300',
        description: 'Random picture',
      },
      name: 'Product 1',

    }
  ]);
  const expandedRows = ref({});
</script>

<template>
  <main class="text-center py-8">
    <h1 class="text-4xl">Results</h1>
    <div class="w-full overflow-x-clip">
      <DataTable :expandedRows="expandedRows" :value="products" dataKey="id">
        <Column field="image">
          <template #body="slotProps">
            <img :src="`${slotProps.data.image.src}`" :alt="slotProps.data.image.description" class="shadow-lg" width="64"/>
          </template>
        </Column>
        <Column field="name"/>
        <Column expander style="width: 5rem"/>
        <template #expansion="slotProps">
          <div class="p-4">
            <h5>Orders for {{ slotProps.data.name }}</h5>
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>
