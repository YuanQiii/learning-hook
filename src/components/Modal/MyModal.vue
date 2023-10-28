<template>
  <!-- 为了避免内部传递的props被覆盖掉，v-bind="attrs"需要放在最前面 -->
  <a-modal
    v-bind="attrs"
    v-model:open="open"
    :width="width"
    :wrap-class-name="wrapClassName"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <!-- 默认插槽，为弹窗内容 -->
    <div class="content" v-if="loading"><a-spin /></div>
    <slot v-else></slot>

    <!-- 具名插槽，为弹窗底部 -->
    <template #footer v-if="slots.footer">
      <slot name="footer"></slot>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, withDefaults, useSlots, useAttrs } from 'vue'
import { MODE } from '../../enums/base'

interface PropsType {
  modelValue?: boolean
  fullScreen?: boolean
  loading?: boolean
  mode?: MODE
}

const props = withDefaults(defineProps<PropsType>(), {
  modelValue: false,
  fullScreen: false,
  loading: false,
  mode: MODE.READONLY,
})

// 可以接收父组件传递的属性和事件
const attrs = useAttrs()

// 获取插槽
const slots = useSlots()

// 标题
const title = computed(() => {
  if (Reflect.has(attrs, 'title')) {
    return attrs.title
  } else {
    return props.mode
  }
})

const fullWidth = ref<string>('100%')
const defaultWidth = ref<string>('30%')
// 宽度
const width = computed(() => {
  if (props.fullScreen) {
    return fullWidth.value
  } else {
    if (Reflect.has(attrs, 'width')) {
      defaultWidth.value = attrs.width as string
    }
    return defaultWidth.value
  }
})

// v-model 监听弹窗是否显示
// 监听确认，取消回调函数
const emits = defineEmits<{
  (event: 'update:modelValue', ...args: any[]): void
  (event: 'ok'): void
  (event: 'cancel'): void
}>()

// 全屏 CSS 类名
const wrapClassName = computed(() => {
  return props.fullScreen ? 'full-modal' : ''
})

// 弹窗显示变量
const open = computed({
  // get 方法需返回 modelValue prop
  get() {
    return props.modelValue
  },
  // set 方法需触发相应的事件
  set(value) {
    emits('update:modelValue', value)
  },
})

/**
 * 取消回调函数
 */
const handleCancel = () => {
  open.value = false
  // 触发事件 cancel
  emits('cancel')
}

/**
 * 确认回调函数
 */
const handleOk = () => {
  open.value = false
  // 触发事件 ok
  emits('ok')
}
</script>

<style lang="less">
// 全屏样式
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}

.content {
  text-align: center;
}
</style>
