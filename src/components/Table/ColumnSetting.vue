<template>
  <a-drawer v-model:open="open" title="列设置" placement="right">
    <a-table :columns="columns" :data-source="_columnSettingData" bordered>
      <template #bodyCell="scope">
        <template v-if="scope.column.key === 'title'">
          {{ scope.record[scope.column.key] }}
        </template>
        <template v-else>
          <a-switch v-model:checked="scope.record.isShow" />
        </template>
      </template>
    </a-table>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, watchEffect } from 'vue'
import { ColumnProps } from './interface'

const props = defineProps<{ columnSettingData: ColumnProps[] }>()

const _columnSettingData = reactive(props.columnSettingData)

const open = ref(false)
const columns = [
  {
    title: '列名',
    key: 'title',
  },
  {
    title: '显示',
    key: 'isShow',
  },
]

const openColumnSetting = () => {
  open.value = true
}

defineExpose({
  openColumnSetting,
})
</script>
