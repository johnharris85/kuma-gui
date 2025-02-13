<template>
  <div
    class="data-overview"
    data-testid="data-overview"
  >
    <div class="data-table-controls mb-2">
      <slot name="additionalControls" />

      <KButton
        class="refresh-button"
        appearance="primary"
        :disabled="isLoading"
        icon="redo"
        data-testid="data-overview-refresh-button"
        @click="onRefreshButtonClick"
      >
        Refresh
      </KButton>
    </div>

    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="isEmpty" />

    <div
      v-else
      class="data-overview-content"
    >
      <div
        v-if="!tableDataIsEmpty && tableData"
        class="data-overview-table"
      >
        <KTable
          :key="tableRecomputationKey"
          class="data-overview-table"
          :class="{ 'data-table-is-hidden' : tableDataIsEmpty }"
          :fetcher="tableDataFetcher"
          :headers="tableHeaders"
          :cell-attrs="getCellAttributes"
          :row-attrs="getRowAttributes"
          disable-pagination
          is-clickable
          data-testid="data-overview-table"
          @row:click="tableRowHandler"
        >
          <template
            v-for="slot in customSlots"
            #[slot]="{ rowValue, row }"
          >
            <slot
              :name="slot"
              :row-value="rowValue"
              :row="row"
            />
          </template>

          <template #status="{ rowValue }">
            <StatusBadge
              v-if="rowValue"
              :status="rowValue"
            />

            <template v-else>
              —
            </template>
          </template>

          <template #tags="{ rowValue }">
            <TagList :tags="rowValue" />
          </template>

          <template #entity="{ rowValue, row }">
            <router-link
              v-if="row.detailViewRoute"
              :to="row.detailViewRoute"
            >
              {{ rowValue.name }}
            </router-link>

            <template v-else>
              {{ rowValue.name }}
            </template>
          </template>

          <template #mesh="{ rowValue }">
            <router-link
              v-if="rowValue.route"
              :to="rowValue.route"
            >
              {{ rowValue.title }}
            </router-link>

            <template v-else>
              {{ rowValue.title }}
            </template>
          </template>

          <template #service="{ rowValue }">
            <router-link
              v-if="rowValue.route"
              :to="rowValue.route"
            >
              {{ rowValue.title }}
            </router-link>

            <template v-else>
              {{ rowValue.title }}
            </template>
          </template>

          <template #zone="{ rowValue }">
            <router-link
              v-if="rowValue.route"
              :to="rowValue.route"
            >
              {{ rowValue.title }}
            </router-link>

            <template v-else>
              {{ rowValue.title }}
            </template>
          </template>

          <template #totalUpdates="{ row }">
            <span>
              {{ row.totalUpdates }}
            </span>
          </template>

          <template #dpVersion="{ row, rowValue }">
            <div
              :class="{
                'with-warnings': row.unsupportedEnvoyVersion || row.unsupportedKumaDPVersion || row.kumaDpAndKumaCpMismatch,
              }"
            >
              {{ rowValue }}
            </div>
          </template>

          <template #envoyVersion="{ row, rowValue }">
            <div
              :class="{
                'with-warnings': row.unsupportedEnvoyVersion,
              }"
            >
              {{ rowValue }}
            </div>
          </template>

          <template
            v-if="showWarnings"
            #warnings="{ row }"
          >
            <KIcon
              v-if="row.withWarnings"
              class="mr-1"
              icon="warning"
              color="var(--black-500)"
              secondary-color="var(--yellow-300)"
              size="20"
            />
          </template>
        </KTable>

        <PaginationWidget
          :has-previous="internalPageOffset > 0"
          :has-next="Boolean(next)"
          @next="goToNextPage"
          @previous="goToPreviousPage"
        />
      </div>

      <EmptyBlock v-if="tableDataIsEmpty && tableData">
        <template #title>
          <img
            class="mb-3"
            src="@/assets/images/icon-empty-table.svg?url"
          >

          <p v-if="emptyState.title">
            {{ emptyState.title }}
          </p>

          <p v-else>
            No items found
          </p>
        </template>

        <template
          v-if="emptyState.message"
          #message
        >
          {{ emptyState.message }}
        </template>
      </EmptyBlock>

      <div
        v-if="$slots.content"
        class="data-overview-content mt-6"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { datadogLogs } from '@datadog/browser-logs'
import { KButton, KIcon, KTable } from '@kong/kongponents'
import { computed, PropType, ref, useSlots, watch } from 'vue'

import EmptyBlock from './EmptyBlock.vue'
import ErrorBlock from './ErrorBlock.vue'
import LoadingBlock from './LoadingBlock.vue'
import PaginationWidget from './PaginationWidget.vue'
import TagList from './TagList.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { TableData } from '@/types/index.d'
import { datadogLogEvents } from '@/utilities/datadogLogEvents'

const slots = useSlots()

const props = defineProps({
  selectedEntityName: {
    type: String,
    required: false,
    default: '',
  },

  pageSize: {
    type: Number,
    required: false,
    default: 12,
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  error: {
    type: [Error, null] as PropType<Error | null>,
    required: false,
    default: null,
  },

  isEmpty: {
    type: Boolean,
    required: false,
    default: false,
  },

  emptyState: {
    type: Object,
    required: false,
    default: null,
  },

  tableData: {
    type: Object as PropType<TableData>,
    required: false,
    default: null,
  },

  tableDataIsEmpty: {
    type: Boolean,
    required: false,
    default: false,
  },

  showWarnings: {
    type: Boolean,
    required: false,
    default: false,
  },

  next: {
    type: [String, Boolean, null] as PropType<string | boolean | null>,
    required: false,
    default: false,
  },

  pageOffset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const emit = defineEmits(['table-action', 'refresh', 'load-data'])

const internalPageOffset = ref(props.pageOffset)
const tableRecomputationKey = ref(0)

const tableHeaders = computed(() => {
  if (!props.showWarnings) {
    return props.tableData.headers.filter((header) => header.key !== 'warnings')
  } else {
    return props.tableData.headers
  }
})
const customSlots = computed(() => props.tableData.headers.map((header) => header.key).filter((key) => slots[key]))
const selectedEntityName = computed(() => {
  if (props.selectedEntityName !== '') {
    return props.selectedEntityName
  } else if (props.tableData.data.length > 0) {
    return props.tableData.data[0].name
  } else {
    return ''
  }
})

/**
 * Just changing the table data/headers doesn’t cause the table component to re-render, so by updating its `key` prop when this happens, we force a re-render. This is necessary to get the column visibility toggles and similar operations to work in the data planes list view.
 */
watch(() => props.tableData, function () {
  tableRecomputationKey.value++
})

function tableDataFetcher(): { data: object[], total: number } {
  return {
    data: props.tableData.data,
    total: props.tableData.data.length,
  }
}

function tableRowHandler(_e: any, row: any): void {
  emit('table-action', row.entity ?? row)
}

function onRefreshButtonClick(): void {
  emit('refresh')
  emit('load-data', internalPageOffset.value)
  datadogLogs.logger.info(datadogLogEvents.TABLE_REFRESH_BUTTON_CLICKED)
}

function goToPreviousPage(): void {
  internalPageOffset.value = props.pageOffset - props.pageSize
  emit('load-data', props.pageOffset - props.pageSize)
}

function goToNextPage(): void {
  internalPageOffset.value = props.pageOffset + props.pageSize
  emit('load-data', props.pageOffset + props.pageSize)
}

function getCellAttributes({ headerKey }: any): Record<string, string> {
  const className = ['warnings'].includes(headerKey) ? 'text-center' : ['details'].includes(headerKey) ? 'text-right' : ''

  return { class: className }
}

function getRowAttributes(row: any): Record<string, string> {
  if (!row) {
    return {}
  }

  const attributes: Record<string, string> = {}

  const name = row.entity?.name ?? row.name
  if (name === selectedEntityName.value) {
    attributes.class = 'is-selected'
  }

  return attributes
}
</script>

<style lang="scss" scoped>
.refresh-icon {
  &.is-spinning g {
    animation: spin 1.2s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(1turn);
    }
  }
}

.data-table-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-sm) 0 var(--spacing-sm);
}

.with-warnings {
  color: var(--yellow-500);
}
</style>

<style lang="scss">
.data-overview-table .is-selected {
  background-color: var(--grey-100);
}
</style>
