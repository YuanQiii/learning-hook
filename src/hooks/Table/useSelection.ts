import { ref, computed } from 'vue'

/**
 * @description 表格多选数据操作
 * */
export const useSelection = () => {
  // 当前选中的所有数据
  const selectedRowKeys = ref<string[]>([])
  // 是否选中
  const hasSelected = computed(() => selectedRowKeys.value.length > 0)
  // 选中变化时触发
  const onSelectChange = (rowKeys: string[]) => {
    selectedRowKeys.value = rowKeys
  }

  return {
    hasSelected,
    selectedRowKeys,
    onSelectChange,
  }
}
