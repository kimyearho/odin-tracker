<template>
  <el-dialog
    title="사용법"
    width="30%"
    v-model="isModalShow"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <ol class="result-dialog">
      <li>본인 캐릭터의 레벨/명중/추가 명중(근거리/원거리/마법)을 입력 합니다.</li>
      <li>사냥터별 명중률을 함께 계산하고 싶다면 사냥터를 선택 해주세요.</li>
      <li>스킬 적중률은 평타 적중률의 10%를 보정합니다.</li>
      <li>낮은 레벨의 부캐릭터에 장비를 옴겼을때는 레벨 대비 명중이 크게 초과하므로 계산되지 않습니다.</li>
    </ol>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClose">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  name: 'CharInfoModal',
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
