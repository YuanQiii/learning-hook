<template>
  <MyTable :columns="columns" :request-api="getTableList">
    <template #tableHeader="scope">
      <a-button type="primary" @click="message.success('增加')"> 增加 </a-button>
      <a-button
        type="primary"
        danger
        @click="message.success(scope.selectedRowKeys)"
        :disabled="!scope.hasSelected"
      >
        删除
      </a-button>
    </template>

    <template #usernameHeader="scope">
      <a-button type="primary" @click="message.success('我是通过作用域插槽渲染的表头')">
        {{ scope.column?.title }}
      </a-button>
    </template>

    <template #operation="scope">
      <a-button type="primary" link @click="message.success(scope.record.id)">详情</a-button>
    </template>
  </MyTable>
</template>
<script lang="tsx" setup>
import { reactive } from 'vue'
import MyTable from '../components/Table/MyTable.vue'
import { ColumnProps, SearchType, HeaderRenderScope } from '../components/Table/interface'
import { User } from '../api/interface'
import { message } from 'ant-design-vue'
import axios from 'axios'

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
      {scope.column.key}
    </a-button>
  )
}

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  {
    key: '#',
    title: '#',
  },
  {
    key: 'id',
    title: 'ID',
  },
  {
    key: 'username',
    title: '用户姓名',
    search: {
      el: SearchType.INPUT,
      tooltip: '我是搜索提示',
    },
    customRender: (scope) => {
      return (
        <a-button type='link' onClick={() => message.success('我是通过 tsx 语法渲染的内容')}>
          {scope.record.username}
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
    sorter: (a: User.ResUserList, b: User.ResUserList) => a.user.detail.age - b.user.detail.age,
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
    customRender: (scope) => {
      return (
        <a-switch
          v-model:checked={scope.record.status}
          checked-children='启用'
          un-checked-children='禁止'
        />
      )
    },
  },
  {
    key: 'createTime',
    title: '创建时间',
    headerRender,
    search: {
      el: SearchType.DATE_PICKER,
      span: 2,
      props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
    },
  },
  {
    key: 'operation',
    title: '操作',
    fixed: 'right',
    width: 330,
  },
])

/**
 * 获取表格数据
 * @param params
 * @returns {Promise<User.ResUserList[]>}
 * @constructor
 */
const getTableList = () => {
  return axios.post<User.ResUserList>(
    'https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e/geeker/user/list',
  )
}
</script>
