<template>
  <div class="app-sidebar-wrapper">
    <aside class="app-sidebar">
      <template
        v-for="(item, index) in navItems"
        :key="index"
      >
        <template v-if="item.isMeshSelector">
          <AppMeshSelector
            v-if="meshes.length > 0"
            :meshes="meshes"
          />
        </template>

        <AppNavItem
          v-else
          v-bind="item"
        />
      </template>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'

import AppMeshSelector from './AppMeshSelector.vue'
import AppNavItem from './AppNavItem.vue'
import { useStore } from '@/store/store'
import { useNav } from '@/utilities'
import { poll } from '@/utilities/poll'

const POLLING_INTERVAL_IN_SECONDS = 10

const store = useStore()
const getNavItems = useNav()

const navItems = computed(() => getNavItems(store.getters['config/getMulticlusterStatus'], store.state.meshes.items.length > 0))
const meshes = computed(() => store.state.meshes.items)

watch(() => store.state.selectedMesh, () => {
  store.dispatch('sidebar/getMeshInsights')
})

let shouldStopPolling = false

onMounted(function () {
  window.addEventListener('blur', setShouldStopPolling)
  window.addEventListener('focus', startPolling)
})

onUnmounted(function () {
  window.removeEventListener('blur', setShouldStopPolling)
  window.removeEventListener('focus', startPolling)
})

startPolling()

function setShouldStopPolling() {
  shouldStopPolling = true
}

function startPolling() {
  shouldStopPolling = false
  poll(fetchInsights, POLLING_INTERVAL_IN_SECONDS * 1000, () => shouldStopPolling)
}

function fetchInsights() {
  return store.dispatch('sidebar/getInsights')
}
</script>

<style lang="scss" scoped>
// This wrapping element is necessary. It ensures that the sidebar can participate in a grid or flex container.
.app-sidebar-wrapper {
  position: static;
}

.app-sidebar {
  width: var(--AppSidebarWidth);
  position: fixed;
  z-index: 10;
  top: var(--AppHeaderHeight);
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding-top: var(--spacing-xs);
  padding-right: var(--spacing-xs);
  border-right: var(--KCardBorder);
  background-color: var(--white);
}
</style>
