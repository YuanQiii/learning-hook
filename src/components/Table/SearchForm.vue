<template>
  <a-form :model="searchParam">
    <a-form-item v-for="(item, index) in columns" :key="index" :label="item.title">
      <SearchFormItem :column="item" :search-param="searchParam" />
    </a-form-item>
  </a-form>
  <a-button type="primary" @click="search">搜索</a-button>
</template>

<script lang="ts" setup>
import { withDefaults, computed } from 'vue'
import SearchFormItem from './SearchFormItem.vue'
import { ColumnProps } from './interface'

interface TableProps {
  columns?: ColumnProps[] // 搜索配置列
  searchParam?: { [key: string]: any } // 搜索参数
  //   searchCol: number | Record<BreakPoint, number>;
  search: (params: any) => void // 搜索方法
  reset: (params: any) => void // 重置方法
}

// 默认值
const props = withDefaults(defineProps<TableProps>(), {
  columns: () => [],
  searchParam: () => ({}),
})
</script>
