<template>
  <KButton
    class="docs-link"
    appearance="outline"
    target="_blank"
    :to="props.href"
  >
    <KIcon
      icon="externalLink"
      color="currentColor"
      size="16"
      hide-title
    />

    Documentation
  </KButton>
</template>

<script lang="ts" setup>
import { KButton, KIcon } from '@kong/kongponents'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
})
</script>
