import { ref, reactive } from 'vue'
import {ElMessage} from 'element-plus'
import $axios from '@/plugins/axios'

function calculatorService() {
  const userLevel = ref(57)
  const userHitRate = ref(156)
  const userCharHitRate = ref(12)
  const hitRateAvg = ref(0) //* 평타 적중률
  const hitRateSkill = ref(0) //* 스킬 적중률
  const mobAreaMinLevelHitRate = ref(0) //* 사냥터 최소 레벨 적중률
  const mobAreaMinLevelSkillHitRate = ref(0) //* 사냥터 최소 레벨 스킬 적중률
  const mobAreaMaxLevelHitRate = ref(0) //* 사냥터 최대 레벨 적중률
  const mobAreaMaxLevelSkillHitRate = ref(0) //* 사냥터 최대 레벨 스킬 적중률
  const state = reactive({
    mobArea: '',
    mobAreaLevel: ''
  })

  function hitRateResult() {
    //* 입력한 정보를 토대로 기준치를 산출.
    let rateMark = userHitRate.value - userLevel.value * 3
    if (userCharHitRate.value > 0) {
      rateMark = rateMark + userCharHitRate.value
    }

    //* 양수 최대 값
    const plusMax = 12
    //* 음수 최대 값
    const minusMax = -33

    //* 양수 및 음수를 초과한 기준치는 계산하지 않음.
    if (rateMark > plusMax) {
      ElMessage({
        message: '[기준치 초과] 명중률 최대 계산율인 88.89%를 초과 했음.',
        type: 'error'
      })
      return
    }

    if (rateMark < minusMax) {
      ElMessage({
        message: '[기준치 초과] 명중률 최하 계산율인 45.45%보다 낮음.',
        type: 'error'
      })
      return
    }

    //* 동일 레벨 적중률 계산
    sameHitRateResult(rateMark)

    //* 사냥터별 적중률 계산
    if (state.mobArea) {
      //* 사냥터 최소레벨 기준치
      const mobAreaMinMark = mobLevelCalcMark(rateMark, 'min')
      if (mobAreaMinMark > plusMax) {
        //* 사냥터 최소레벨 기준치가 표의 최대 기준치를 초과
        mobAreaMinLevelHitRate.value = '-'
        mobAreaMinLevelSkillHitRate.value = '-'
      } else if (mobAreaMinMark < minusMax) {
        //* 사냥터 최소레벨 기준치가 표의 최소 기준치를 초과
        mobAreaMinLevelHitRate.value = '-'
        mobAreaMinLevelSkillHitRate.value = '-'
      } else {
        sameMobAreaHitRateResult(mobAreaMinMark, 'min')
      }

      //* 사냥터 최대레벨 기준치
      const mobAreaMaxMark = mobLevelCalcMark(rateMark, 'max')
      if (mobAreaMaxMark > plusMax) {
        //* 사냥터 최대레벨 기준치가 표의 최대 기준치를 초과
        mobAreaMaxLevelHitRate.value = '-'
        mobAreaMaxLevelSkillHitRate.value = '-'
      } else if (mobAreaMaxMark < minusMax) {
        //* 사냥터 최대레벨 기준치가 표의 최소 기준치를 초과
        mobAreaMaxLevelHitRate.value = '-'
        mobAreaMaxLevelSkillHitRate.value = '-'
      } else {
        sameMobAreaHitRateResult(mobAreaMaxMark, 'max')
      }
    }
  }

  function skillHitRatePercent(hitRate) {
    const rate = hitRate + (hitRate * 10) / 100
    return Number(rate.toFixed(2))
  }

  function sameHitRateResult(mark) {
    $axios.get('/hitRateList.json').then(({data}) => {
      const sameRateArray = data['data'].filter(
        (item) => item.calc_mark === mark
      )
      if (sameRateArray.length > 0) {
        //* 실제 평타 적중률
        hitRateAvg.value = sameRateArray[0]['same_rage']
        //* 실제 스킬 적중률 (+10%)
        hitRateSkill.value = skillHitRatePercent(hitRateAvg.value)
      }
    })
  }

  function sameMobAreaHitRateResult(mobMark, type) {
    $axios.get('/hitRateList.json').then(({data}) => {
      const sameRateArray = data['data'].filter(
        (item) => item.calc_mark === mobMark
      )
      if (sameRateArray.length > 0) {
        if (type === 'min') {
          //* 사냥터별 최소 레벨 평타 적중률
          mobAreaMinLevelHitRate.value = sameRateArray[0]['same_rage']
          mobAreaMinLevelSkillHitRate.value = skillHitRatePercent(
            mobAreaMinLevelHitRate.value
          )
        } else if (type === 'max') {
          //* 사냥터별 최대 레벨 평타 적중률
          mobAreaMaxLevelHitRate.value = sameRateArray[0]['same_rage']
          mobAreaMaxLevelSkillHitRate.value = skillHitRatePercent(
            mobAreaMaxLevelHitRate.value
          )
        }
      }
    })
  }

  function mobLevelCalcMark(mark, key) {
    const result = userLevel.value - state.mobAreaLevel[key]
    return calcMark(mark, result)
  }

  function calcMark(mark, result) {
    //* 결과 값이 양수인 경우
    if (Math.sign(result) === 1) {
      return mark + result * 3
    }
    //* 결과 값이 음수인 경우
    else if (Math.sign(result) === -1) {
      return mark - Math.abs(result) * 3
    }
    //* 결과값이 0, -0, NaN 일 경우
    else {
      return mark
    }
  }

  function changeMobArea(data) {
    state.mobArea = data.name
    state.mobAreaLevel = {
      min: data.min,
      max: data.max
    }
  }

  function reset() {
    userLevel.value = '1'
    userHitRate.value = '10'
    userCharHitRate.value = '0'
    state.mobArea = ''
  }

  return {
    userLevel,
    userHitRate,
    userCharHitRate,
    hitRateAvg,
    hitRateSkill,
    hitRateResult,
    mobAreaMinLevelHitRate,
    mobAreaMaxLevelHitRate,
    mobAreaMinLevelSkillHitRate,
    mobAreaMaxLevelSkillHitRate,
    changeMobArea,
    reset,
    state
  }
}

export default calculatorService