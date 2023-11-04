<template>
  <!-- 查询表单 -->
  <div v-show="isShowSearch">
    <SearchForm
      :search="_search"
      :reset="_reset"
      :columns="searchColumns"
      :search-param="searchParam"
    />
  </div>

  <!-- 整体表格 -->
  <div>
    <!-- 表格头部 操作按钮 -->
    <div>
      <!-- 批量操作 -->
      <div class="header-button-lf">
        <!-- 表格头部插槽 -->
        <slot name="tableHeader" :selectedRowKeys="selectedRowKeys" :hasSelected="hasSelected" />
      </div>
      <!-- 工具操作 -->
      <div v-if="toolButton" class="header-button-ri">
        <slot name="toolButton">
          <template v-if="showToolButton('refresh')">
            <a-button shape="circle" :icon="h(ReloadOutlined)" @click="getTableList" />
          </template>

          <template v-if="showToolButton('setting')">
            <a-button shape="circle" :icon="h(SettingOutlined)" @click="openColumnSetting" />
          </template>

          <template v-if="showToolButton('search') && searchColumns?.length">
            <a-button
              :icon="h(SearchOutlined)"
              shape="circle"
              @click="isShowSearch = !isShowSearch"
            />
          </template>
        </slot>
      </div>
    </div>

    <!-- 表格主体 -->
    <div>
      <a-table
        ref="tableRef"
        v-bind="$attrs"
        :columns="flatColumns"
        :data-source="processTableData"
        :row-key="rowKey"
        :row-selection="rowSelection"
      >
        <!-- 自定义表格头部插槽 -->
        <template #headerCell="scope">
          <!-- 插槽渲染 -->
          <template v-if="Object.keys($slots).includes(`${scope.column.key}Header`)">
            <slot :name="`${scope.column.key}Header`" v-bind="scope" />
          </template>
          <!-- render渲染 和 默认渲染 -->
          <template v-else>
            <!--  render渲染 -->
            <template v-if="scope.column?.headerRender">
              <component :is="scope.column.headerRender" v-bind="scope"> </component>
            </template>
            <!-- 默认渲染 -->
            <template v-else>
              {{ scope.column?.title }}
            </template>
          </template>
        </template>

        <!-- 自定义表格内容插槽 -->
        <template #bodyCell="scope">
          <component
            v-if="scope.column?.customRender"
            :is="scope.column.customRender"
            v-bind="scope"
          ></component>
          <template v-else-if="scope.column.key === 'operation'">
            <slot name="operation" v-bind="scope" />
          </template>
          <template v-else>
            <span>
              {{ handleProp(scope.record, scope.column.key) ?? scope.index }}
            </span>
          </template>
        </template>

        <!-- 自定义表格标题插槽 -->
        <template #title>
          <slot name="title" />
        </template>

        <!-- 自定义表格总结插槽 -->
        <template #summery>
          <slot name="summery" />
        </template>

        <!-- 自定义表格底部插槽 -->
        <template #footer>
          <slot name="footer" />
        </template>
      </a-table>
    </div>
  </div>

  <!-- 列设置 -->
  <ColumnSetting
    v-if="toolButton"
    ref="columnRef"
    v-model:column-setting-data="columnSettingData"
  />
</template>

<script lang="ts" setup>
import { ref, unref, reactive, computed, provide, h, onMounted, watchEffect } from 'vue'
import { ColumnProps, TypeProps } from '../../components/Table/interface'
import { useTable } from '../../hooks/Table/useTable'
import { useSelection } from '../../hooks/Table/useSelection'
import SearchForm from './SearchForm.vue'
import { ReloadOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { handleProp } from '../../utils'
import ColumnSetting from './ColumnSetting.vue'

export interface TableProps {
  columns: ColumnProps[] // 列配置项  ==> 必传
  data?: any[] // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any> // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string // 表格标题 ==> 非必传
  pagination?: boolean // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: ('refresh' | 'setting' | 'search')[] | boolean // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  // searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<TableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: {},
  border: true,
  toolButton: true,
  rowKey: 'id',
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
})

// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns)

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>())
const setEnumMap = async ({ key, enum: enumValue }: ColumnProps) => {
  if (!enumValue) return

  // 如果当前 enumMap 存在相同的值 return
  if (
    enumMap.value.has(String(key)!) &&
    (typeof enumValue === 'function' || enumMap.value.get(String(key)!) === enumValue)
  )
    return

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== 'function') return enumMap.value.set(String(key)!, unref(enumValue!))

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue()
  enumMap.value.set(String(key)!, data)
}

// 注入 enumMap
provide('enumMap', enumMap)

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async (col) => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
    flatArr.push(col)

    // column 添加默认 isShow && isFilterEnum 属性值
    col.isShow = col.isShow ?? true
    col.isFilterEnum = col.isFilterEnum ?? true
    col.align = 'center'

    // 设置 enumMap
    await setEnumMap(col)
  })
  return flatArr.filter((item) => !item._children?.length)
}

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns).filter((item) => item.isShow))

// 是否显示搜索模块
const isShowSearch = ref(true)

// 表格操作 Hooks
const {
  tableData,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
} = useTable(
  props.requestApi,
  props.initParam,
  props.pagination,
  props.dataCallback,
  props.requestError,
)

// 初始化表格数据 && 拖拽排序
onMounted(() => {
  props.requestAuto && getTableList()
  props.data && (pageable.value.total = props.data.length)
})

// 表格多选 Hooks
const { onSelectChange, selectedRowKeys, hasSelected } = useSelection()

// 表格多选配置
const rowSelection = reactive({
  selectedRowKeys,
  onChange: onSelectChange,
})

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) return tableData.value
  if (!props.pagination) return props.data
  return props.data.slice(
    (pageable.value.pageNum - 1) * pageable.value.pageSize,
    pageable.value.pageSize * pageable.value.pageNum,
  )
})

// 定义 emit 事件
const emit = defineEmits<{
  search: []
  reset: []
  dargSort: [{ newIndex?: number; oldIndex?: number }]
}>()

const _search = () => {
  search()
  emit('search')
}

const _reset = () => {
  reset()
  emit('reset')
}

// 控制 ToolButton 显示
const showToolButton = (key: 'refresh' | 'setting' | 'search') => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton
}

// column 列类型
const columnTypes: TypeProps[] = ['selection', 'radio', 'index', 'expand', 'sort']

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter((item) => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!)
})

// 列设置 ==> 需要过滤掉不需要设置的列
const columnRef = ref()
// const columnSettingData = computed<ColumnProps[]>(() => {
//   return tableColumns.filter((item) => {
//     const { key } = item
//     return key !== 'operation'
//   })
// })
const columnSettingData = flatColumns.value.filter((item) => {
  const { key } = item
  return key !== 'operation'
})

watchEffect(() => {
  console.log(columnSettingData)
})

const openColumnSetting = () => columnRef.value.openColumnSetting()
</script>
