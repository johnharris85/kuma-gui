<template>
  <dl class="definition-list">
    <slot />
  </dl>
</template>

<style lang="scss" scoped>
.definition-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
