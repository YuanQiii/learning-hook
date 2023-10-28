import useModalState from './useModalState'
import { MODE } from '../../enums/base'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm

interface Props {
  [key: string]: any
}

export default function useModalWithForm(modelRef: Props) {
  const { visible, mode, updateMode } = useModalState()

  const { resetFields } = useForm(modelRef)

  /**
   * 关闭表单弹窗
   */
  const closeModal = () => {
    resetFields()
    visible.value = false
  }

  /**
   * 打开表单弹窗
   * @param target 弹窗类型，更改弹窗标题
   */
  const openModal = (target: MODE) => {
    updateMode(target)
    visible.value = true
  }

  return { visible, mode, openModal, closeModal }
}
