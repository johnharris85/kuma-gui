<template>
  <KCard>
    <template #body>
      <LoadingBlock v-if="code === null" />

      <CodeBlock
        v-else
        id="code-block-diagnostics"
        language="json"
        :code="code"
        is-searchable
        query-key="diagnostics"
      />
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { computed } from 'vue'

import CodeBlock from '@/app/common/CodeBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useStore } from '@/store/store'

const store = useStore()

const code = computed(() => {
  const config = store.getters['config/getConfig']

  if (config) {
    return JSON.stringify(config, null, 2)
  } else {
    return null
  }
})
</script>
