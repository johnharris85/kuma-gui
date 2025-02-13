<template>
  <ContentWrapper>
    <template #content>
      <DataOverview
        :selected-entity-name="service?.name"
        :page-size="PAGE_SIZE_DEFAULT"
        :error="error"
        :is-loading="isLoading"
        :empty-state="EMPTY_STATE"
        :table-data="tableData"
        :table-data-is-empty="tableData.data.length === 0"
        :next="nextUrl"
        :page-offset="pageOffset"
        @table-action="loadEntity"
        @load-data="loadData"
      />
    </template>

    <template #sidebar>
      <ServiceSummary
        v-if="service !== null"
        :service="service"
        :external-service="externalService"
      />
    </template>
  </ContentWrapper>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, RouteLocationNamedRaw } from 'vue-router'

import ServiceSummary from '../components/ServiceSummary.vue'
import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { ExternalService, ServiceInsight, TableHeader } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

type ServiceInsightTableRow = Pick<ServiceInsight, 'serviceType' | 'addressPort' | 'status'> & {
  entity: ServiceInsight
  detailViewRoute: RouteLocationNamedRaw
  dpProxiesStatus: string
}

const kumaApi = useKumaApi()

const headers: TableHeader[] = [
  { label: 'Name', key: 'entity' },
  { label: 'Type', key: 'serviceType' },
  { label: 'Address', key: 'addressPort' },
  { label: 'Status', key: 'status' },
  { label: 'DP proxies (online / total)', key: 'dpProxiesStatus' },
]
const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no service insights present.',
}

const route = useRoute()

const props = defineProps({
  selectedServiceName: {
    type: String,
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
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)
const service = ref<ServiceInsight | null>(null)
const externalService = ref<ExternalService | null>(null)
const tableData = ref<{ headers: TableHeader[], data: ServiceInsightTableRow[] }>({
  headers,
  data: [],
})

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'service-list-view') {
    return
  }

  loadData(0)
})

loadData(props.offset)

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const mesh = route.params.mesh as string
  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllServiceInsightsFromMesh({ mesh }, { size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    await loadEntity({ name: props.selectedServiceName ?? tableData.value.data[0]?.entity.name, mesh })
  } catch (err) {
    tableData.value.data = []
    service.value = null
    externalService.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(serviceInsights: ServiceInsight[]): ServiceInsightTableRow[] {
  return serviceInsights.map((serviceInsight) => {
    const { serviceType = 'internal', addressPort } = serviceInsight
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'service-detail-view',
      params: {
        mesh: serviceInsight.mesh,
        service: serviceInsight.name,
      },
    }

    let dpProxiesStatus = '—'
    if (serviceInsight.dataplanes) {
      const { online = 0, total = 0 } = serviceInsight.dataplanes
      dpProxiesStatus = `${online} / ${total}`
    }

    return {
      entity: serviceInsight,
      detailViewRoute,
      serviceType,
      dpProxiesStatus,
      addressPort,
    }
  })
}

async function loadEntity({ name, mesh }: { name?: string | undefined, mesh: string }) {
  if (name !== undefined) {
    service.value = await kumaApi.getServiceInsight({ mesh, name })

    if (service.value.serviceType === 'external') {
      externalService.value = await kumaApi.getExternalServiceByServiceInsightName(mesh, name)
    }

    QueryParameter.set('service', name)
  } else {
    service.value = null
    externalService.value = null
    QueryParameter.set('service', null)
  }
}
</script>
