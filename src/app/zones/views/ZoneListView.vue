<template>
  <div class="zones">
    <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

    <div
      v-else
      class="kcard-stack"
    >
      <div class="kcard-border">
        <DataOverview
          :selected-entity-name="entity?.name"
          :page-size="PAGE_SIZE_DEFAULT"
          :is-loading="isLoading"
          :error="error"
          :empty-state="EMPTY_STATE"
          :table-data="tableData"
          :table-data-is-empty="tableData.data.length === 0"
          :show-warnings="tableData.data.some((item) => item.withWarnings)"
          :next="nextUrl"
          :page-offset="pageOffset"
          @table-action="loadEntity"
          @load-data="loadData"
        />
      </div>

      <div
        v-if="entity !== null"
        class="kcard-border"
      >
        <ZoneDetails :zone-overview="entity" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import ZoneDetails from '../components/ZoneDetails.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { StatusKeyword, TableHeader, ZoneOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { fetchAllResources } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'

type ZoneOverviewTableRow = {
  entity: ZoneOverview
  detailViewRoute: RouteLocationNamedRaw
  status: StatusKeyword
  zoneCpVersion: string
  storeType: string
  hasIngress: 'Yes' | 'No'
  hasEgress: 'Yes' | 'No'
  withWarnings: boolean
}

const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zones present.',
}

const route = useRoute()
const store = useStore()

const props = defineProps({
  selectedZoneName: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const isLoading = ref(true)
const error = ref<Error | null>(null)
const tableData = ref<{ headers: TableHeader[], data: ZoneOverviewTableRow[] }>({
  headers: [
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'entity' },
    { label: 'Zone CP Version', key: 'zoneCpVersion' },
    { label: 'Storage type', key: 'storeType' },
    { label: 'Ingress', key: 'hasIngress' },
    { label: 'Egress', key: 'hasEgress' },
    { label: 'Warnings', key: 'warnings', hideLabel: true },
  ],
  data: [],
})
const entity = ref<ZoneOverview | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)
const zonesWithIngress = ref(new Set())
const zonesWithEgress = ref(new Set())

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'zone-list-view') {
    return
  }

  init(0)
})

onBeforeMount(function () {
  init(props.offset)
})

function init(offset: number): void {
  if (store.getters['config/getMulticlusterStatus']) {
    loadData(offset)
  }
}

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const size = PAGE_SIZE_DEFAULT

  try {
    const [{ items, next }, { items: zoneIngressOverviews }, { items: zoneEgressOverviews }] = await Promise.all([
      kumaApi.getAllZoneOverviews({ size, offset }),
      fetchAllResources(kumaApi.getAllZoneIngressOverviews.bind(kumaApi)),
      fetchAllResources(kumaApi.getAllZoneEgressOverviews.bind(kumaApi)),
    ])

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    zonesWithIngress.value = new Set(zoneIngressOverviews.map((zoneIngressOverview) => zoneIngressOverview.zoneIngress.zone))
    zonesWithEgress.value = new Set(zoneEgressOverviews.map((zoneEgressOverview) => zoneEgressOverview.zoneEgress.zone))
    await loadEntity({ name: props.selectedZoneName ?? tableData.value.data[0]?.entity.name })
  } catch (err) {
    tableData.value.data = []
    entity.value = null
    zonesWithIngress.value = new Set()
    zonesWithEgress.value = new Set()

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(zoneOverviews: ZoneOverview[]): ZoneOverviewTableRow[] {
  return zoneOverviews.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-detail-view',
      params: {
        zone: name,
      },
    }
    let zoneCpVersion = '-'
    let storeType = ''
    let cpCompat = true

    const subscriptions = entity.zoneInsight?.subscriptions ?? []

    subscriptions.forEach((item: any) => {
      if (item.version && item.version.kumaCp) {
        zoneCpVersion = item.version.kumaCp.version
        const { kumaCpGlobalCompatible = true } = item.version.kumaCp

        cpCompat = kumaCpGlobalCompatible
        if (item.config) {
          storeType = JSON.parse(item.config).store.type
        }
      }
    })

    const status = getItemStatusFromInsight(entity.zoneInsight)

    return {
      entity,
      detailViewRoute,
      status,
      zoneCpVersion,
      storeType,
      hasIngress: zonesWithIngress.value.has(entity.name) ? 'Yes' : 'No',
      hasEgress: zonesWithEgress.value.has(entity.name) ? 'Yes' : 'No',
      withWarnings: !cpCompat,
    }
  })
}

async function loadEntity({ name }: { name?: string | undefined }) {
  if (name === undefined) {
    entity.value = null
    QueryParameter.set('zone', null)
    return
  }

  try {
    entity.value = await kumaApi.getZoneOverview({ name })
    QueryParameter.set('zone', name)
  } catch (err) {
    console.error(err)
  }
}
</script>
