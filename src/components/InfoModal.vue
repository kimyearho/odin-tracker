<template>
  <el-dialog
    title="참고"
    width="30%"
    v-model="isModalShow"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <ol class="result-dialog">
      <li>이 프로그램은 오딘 인벤 명중률 실험 리포트를 참고하여 만듬. 따라서, 계산식과 기준표는 리포트에 있는것과 동일함. (https://www.inven.co.kr/webzine/news/?news=259851&site=odin)</li>
      <li>결과값은 기본 공격 명중률 / 스킬 적중률% 형태로 표시함.</li>
      <li>최대 명중률 88.88%, 최소 명중률 45.45%이하는 계산되지 않음. 사냥터 명중률의 경우 --%로 표시함.</li>
      <li>동일 레벨 명중률은 레벨업시 항상 감소함. 명중은 3의 배수이므로 레벨업시 증가하는 명중외에 최소 1을 더 채워야 떨어진 명중률이 원복됨.</li>
      <li>사냥터 경우 몬스터들의 정확한 레벨 표시가 없으므로 맵 기준 최소 레벨과, 최대 레벨간의 적중률을 계산 함.</li>
      <li>스킬 적중률은 평타 적중률의 10%를 보정함.</li>
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
  name: 'InfoModal',
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
