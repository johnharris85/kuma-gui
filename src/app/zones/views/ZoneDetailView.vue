<template>
  <div class="zone-details">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="zoneOverview === null" />

    <div
      v-else
      class="kcard-border"
    >
      <ZoneDetails :zone-overview="zoneOverview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ZoneDetails from '../components/ZoneDetails.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useStore } from '@/store/store'
import type { ZoneOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

const zoneOverview = ref<ZoneOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name === 'zone-detail-view') {
    loadData()
  }
})

watch(() => route.params.name, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name === 'zone-detail-view') {
    loadData()
  }
})

start()

function start() {
  store.dispatch('updatePageTitle', route.params.zone)

  loadData()
}

async function loadData() {
  isLoading.value = true
  error.value = null

  const name = route.params.zone as string

  try {
    zoneOverview.value = await kumaApi.getZoneOverview({ name })
  } catch (err) {
    zoneOverview.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
