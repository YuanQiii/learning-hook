<template>
  <MyTable :columns="columns" />
</template>
<script lang="tsx" setup>
import { reactive } from 'vue'
import MyTable from '../components/Table/MyTable.vue'
import { ColumnProps, SearchType, HeaderRenderScope } from '../components/Table/interface'
import { User } from '../api/interface'
import { message } from 'ant-design-vue'

const genderType = [
  {
    label: '男',
    value: 'male',
    children: [
      {
        label: '0',
        value: '0',
      },
    ],
  },
  {
    label: '女',
    value: 'female',
    children: [
      {
        label: '1',
        value: '1',
      },
    ],
  },
]

const userStatus = [
  {
    label: '启用',
    value: 'true',
  },
  {
    label: '禁用',
    value: 'false',
  },
]

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return (
    <a-button type='primary' onClick={() => message.success('我是通过 tsx 语法渲染的表头')}>
      {scope.column.title}
    </a-button>
  )
}

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { type: 'sort', title: 'Sort', width: 80 },
  { type: 'expand', title: 'Expand', width: 85 },
  {
    key: 'username',
    title: '用户姓名',
    search: {
      el: SearchType.INPUT,
      tooltip: '我是搜索提示',
    },
    render: (scope) => {
      return (
        <a-button
          type='primary'
          link
          onClick={() => message.success('我是通过 tsx 语法渲染的内容')}>
          {scope.row.username}
        </a-button>
      )
    },
  },
  {
    key: 'gender',
    title: '性别',
    // 字典数据（本地数据）
    enum: genderType,
    // 字典请求不带参数
    // enum: getUserGender,
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: SearchType.TREE_SELECT, props: { treeCheckable: true } },
    // fieldNames: { label: 'genderLabel', value: 'genderValue' },
  },
  {
    // 多级 prop
    key: 'user.detail.age',
    title: '年龄',
    // search: {
    //   // 自定义 search 显示内容
    //   render: ({ searchParam }) => {
    //     return (
    //       <div class='flx-center'>
    //         <a-input vModel_trim={searchParam.minAge} placeholder='最小年龄' />
    //         <span class='mr10 ml10'>-</span>
    //         <a-input vModel_trim={searchParam.maxAge} placeholder='最大年龄' />
    //       </div>
    //     )
    //   },
    // },
  },
  { key: 'idCard', title: '身份证号', search: { el: SearchType.INPUT } },
  { key: 'email', title: '邮箱' },
  { key: 'address', title: '居住地址' },
  {
    key: 'status',
    title: '用户状态',
    enum: userStatus,
    search: { el: SearchType.SELECT },
    // fieldNames: { label: 'userLabel', value: 'userValue' },
    render: (scope) => {
      // return (
      //   <>
      //     {BUTTONS.value.status ? (
      //       <el-switch
      //         model-value={scope.row.status}
      //         active-text={scope.row.status ? "启用" : "禁用"}
      //         active-value={1}
      //         inactive-value={0}
      //         onClick={() => changeStatus(scope.row)}
      //       />
      //     ) : (
      //       <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
      //     )}
      //   </>
      // );

      return (
        <a-switch
          v-model:checked={scope.row.status}
          checked-children='开'
          un-checked-children='关'
        />
      )
    },
  },
  {
    key: 'createTime',
    title: '创建时间',
    headerRender,
    width: 180,
    search: {
      el: SearchType.DATE_PICKER,
      span: 2,
      props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
    },
  },
  { key: 'operation', title: '操作', fixed: 'right', width: 330 },
])
</script>
