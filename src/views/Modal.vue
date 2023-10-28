<template>
  <div @click="handleOpenModal">基本弹窗</div>
  <div @click="handleOpenModalFooter">自定义页脚弹窗</div>
  <div @click="handleOpenModalFormAdd">表单弹窗（添加）</div>
  <div @click="handleOpenModalFormEdit">表单弹窗（编辑）</div>

  <!-- 详情弹窗 -->
  <MyModal v-model="visible" title="详情" @cancel="handleModalCancel" @ok="handleModalOk">
    content
  </MyModal>

  <!-- 自定义页脚按钮 -->
  <MyModal v-model="visibleFooter" :loading="loading" :full-screen="fullScreen">
    content
    <template #footer>
      <a-button @click="handleFooterFullScreen">fullScreen</a-button>
      <a-button @click="handleFooterLoading">Loading</a-button>
      <a-button @click="handleFooterCancel">Return</a-button>
      <a-button @click="handleFooterOk" type="primary">Submit</a-button>
    </template>
  </MyModal>

  <!-- 添加弹窗 -->
  <MyModal
    v-model="visibleFormAdd"
    :title="modeFormAdd"
    @ok="handleModalFormAddOk"
    @cancel="handleModalFormAddCancel"
  >
    <a-form :model="formStateAdd" name="basic" autocomplete="off">
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formStateAdd.username" />
      </a-form-item>
    </a-form>
  </MyModal>

  <!-- 编辑弹窗 -->
  <MyModal
    v-model="visibleFormEdit"
    :title="modeFormEdit"
    @ok="handleModalFormEditOk"
    @cancel="handleModalFormEditCancel"
  >
    <a-form :model="formStateEdit" name="basic" autocomplete="off">
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formStateEdit.username" />
      </a-form-item>
    </a-form>
  </MyModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useModal from '../hooks/Modal/useModal'
import useModalWithForm from '../hooks/Modal/useModalWithForm'
import { MODE } from '../enums/base'
import MyModal from '../components/MyModal.vue'

interface FormState {
  username: string
}

// #region 基本弹窗
const { visible, openModal } = useModal()

/**
 * 打开弹窗
 */
const handleOpenModal = () => {
  openModal()
}

/**
 * 弹窗取消回调
 */
const handleModalCancel = () => {
  console.log('handleModalCancel')
}

/**
 * 弹窗确认回调
 */
const handleModalOk = () => {
  console.log('handleModalOk')
}
// #endregion

// #region 自定义底部按钮弹窗
const {
  visible: visibleFooter,
  openModal: openModalFooter,
  closeModal: closeModalFooter,
  loading,
  openLoading,
  closeLoading,
  fullScreen,
  openFullScreen,
  closeFullScreen,
} = useModal()

/**
 * 打开自定义底部弹窗
 */
const handleOpenModalFooter = () => {
  openModalFooter()
}

/**
 *  自定义底部弹窗FullScreen回调
 */
const handleFooterFullScreen = () => {
  console.log('handleFooterFullScreen')
  fullScreen.value ? closeFullScreen() : openFullScreen()
}

/**
 *  自定义底部弹窗loading回调
 */
const handleFooterLoading = () => {
  console.log('handleFooterLoading')
  loading.value ? closeLoading() : openLoading()
}

/**
 *  自定义底部弹窗取消回调
 */
const handleFooterCancel = () => {
  console.log('handleModalCancel')
  closeModalFooter()
}
/**
 *  自定义底部弹窗确认回调
 */
const handleFooterOk = () => {
  console.log('handleModalOk')
  closeModalFooter()
}
// #endregion

// #region 添加表单弹窗
const formStateAdd = reactive<FormState>({
  username: '',
})

const {
  visible: visibleFormAdd,
  mode: modeFormAdd,
  openModal: openModalFormAdd,
  closeModal: closeModalFormAdd,
} = useModalWithForm(formStateAdd)

/**
 * 打开添加表单弹窗
 */
const handleOpenModalFormAdd = () => {
  openModalFormAdd(MODE.ADD)
}

/**
 * 添加表单弹窗确认回调
 */
const handleModalFormAddOk = () => {
  console.log('handleFormAddOk')
}

/**
 * 添加表单弹窗取消回调
 */
const handleModalFormAddCancel = () => {
  console.log('handleFormCancel')
  closeModalFormAdd()
}
// #endregion

// #region 编辑表单弹窗
const formStateEdit = reactive<FormState>({
  username: 'foo',
})

const {
  visible: visibleFormEdit,
  mode: modeFormEdit,
  openModal: openModalFormEdit,
  closeModal: closeModalFormEdit,
} = useModalWithForm(formStateEdit)

/**
 * 打开编辑表单弹窗
 */
const handleOpenModalFormEdit = () => {
  openModalFormEdit(MODE.EDIT)
}

/**
 * 编辑表单弹窗确认回调
 */
const handleModalFormEditOk = () => {
  console.log('handleModalFormEditOk')
}

/**
 * 编辑表单弹窗取消回调
 */
const handleModalFormEditCancel = () => {
  console.log('handleModalFormEditCancel')
  closeModalFormEdit()
}
// #endregion
</script>
