<template>
  <template
    v-if="
      column.search?.el === SearchType.TREE_SELECT ||
      column.search?.el === SearchType.CASCADER ||
      column.search?.el === SearchType.DATE_PICKER
    "
  >
    <component
      :is="`a-${column.search.el}`"
      v-bind="{ ...placeholder, ...column.search?.props, ...options, searchParam: _searchParam }"
      v-model:value.trim="_searchParam[column.key!]"
    />
  </template>

  <template
    v-else-if="column.search?.el === SearchType.INPUT || column.search?.el === SearchType.SELECT"
  >
    <component
      :is="column.search?.render ?? `a-${column.search?.el}`"
      v-bind="{ ...placeholder, searchParam: _searchParam }"
      v-model:value.trim="_searchParam[column.key!]"
    >
      <template v-if="column.search?.el === SearchType.SELECT">
        <component
          :is="`a-select-option`"
          v-for="(col, index) in options"
          :key="index"
          :value="col.value"
        >
          {{ col.label }}</component
        >
      </template>
    </component>
  </template>

  <template v-else-if="column.search?.render">
    <component :is="column.search.render(SearchRenderScope)"></component>
  </template>

  <slot v-else></slot>
</template>

<script setup lang="ts">
import { computed, inject, ref, reactive } from 'vue'
import { ColumnProps, SearchType } from './interface'

interface SearchFormItem {
  column: ColumnProps
  searchParam: { [key: string]: any }
}

const props = defineProps<SearchFormItem>()

// Re receive SearchParam
const _searchParam = computed(() => props.searchParam)

console.log('column', props.column)

const SearchRenderScope = reactive({
  searchParam: {
    username: 'foo',
  },
  placeholder: 'placeholder',
  clearable: true,
  options: [
    {
      label: 'label',
      value: 'value',
    },
  ],
  data: [
    {
      label: 'label',
      value: 'value',
    },
  ],
})

// 处理默认 placeholder
const placeholder = computed(() => {
  const search = props.column.search
  if (
    ['datetimerange', 'daterange', 'monthrange'].includes(search?.props?.type) ||
    search?.props?.isRange
  ) {
    return { rangeSeparator: '至', startPlaceholder: '开始时间', endPlaceholder: '结束时间' }
  }
  const placeholder =
    search?.props?.placeholder ?? (search?.el?.includes('input') ? '请输入' : '请选择')
  return { placeholder }
})

// 接收 enumMap
const enumMap = inject('enumMap', ref(new Map()))
console.log('enumMap', enumMap.value)

const columnEnum = computed(() => {
  let enumData = enumMap.value.get(props.column.key)
  console.log('enumData', enumData)

  if (!enumData) return []
  return enumData
})

const options = computed(() => {
  if (props.column.search?.el === SearchType.TREE_SELECT) {
    return {
      treeData: columnEnum.value,
    }
  }
  if (props.column.search?.el === SearchType.CASCADER) {
    return {
      options: columnEnum.value,
    }
  }
  return columnEnum.value
})
</script>
