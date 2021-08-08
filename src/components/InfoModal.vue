<template>
  <el-dialog
    title="참고"
    width="30%"
    v-model="isModalShow"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}) {
    const isModalShow = ref(false)
    const handleClose = () => {
      emit('close', false)
    }
    onMounted(() => {
      isModalShow.value = props.isVisible
    })
    return {
      isModalShow,
      handleClose
    }
  }
}
</script>
