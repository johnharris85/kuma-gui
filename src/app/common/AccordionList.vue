<template>
  <ul class="accordion-list">
    <slot />
  </ul>
</template>

<script lang="ts" setup>
import { PropType, provide, ref } from 'vue'

const props = defineProps({
  initiallyOpen: {
    type: [Number, Array] as PropType<number | number[]>,
    required: false,
    default: null,
  },

  multipleOpen: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const count = ref(0)
const active = ref(props.initiallyOpen !== null ? props.initiallyOpen : props.multipleOpen ? [] : null)

provide('parentAccordion', {
  multipleOpen: props.multipleOpen,
  active,
  count,
})
</script>

<style lang="scss" scoped>
.accordion-list {
  list-style: none;
  padding-left: 0;
}
</style>
