<template>
  <el-row :gutter="20">
    <el-col>
      <h1>Odin Tracker</h1>
      <small>개발자: (오딘05/젠붕이) | 문의 사항은 인벤쪽지로</small>
    </el-col>
    <el-col
      class="mt-20"
      :xl="{span: 11}"
      :lg="{span: 4}"
      :md="{span: 6}"
      :sm="{span: 16}"
    >
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <span>캐릭터 정보</span>
          </div>
        </template>
        <el-form
          class="statForm"
          :inline="true"
          size="mini"
          label-position="top"
        >
          <el-form-item>
            <template #label>레벨</template>
            <el-input-number
              v-model="userLevel"
              :min="1"
              :max="90"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <template #label>명중</template>
            <el-input-number
              v-model="userHitRate"
              :min="10"
              :max="300"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <template #label>추가 명중 (근/마/원)</template>
            <el-input-number
              v-model="userCharHitRate"
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <template #label>사냥터 선택</template>
            <el-select
              class="mobSelect"
              :model-value="mobArea"
              placeholder="선택"
              @change="changeMobArea"
            >
              <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span class="mobLevel"
                    >{{ item.value.min }}~{{ item.value.max }}</span
                  >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col>
            <div class="bottom">
              <el-button
                type="warning"
                icon="el-icon-refresh"
                size="small"
                @click="reset"
                >초기화</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-check"
                size="small"
                @click="hitRateResult"
                >계산하기</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col
      class="mt-20"
      :xl="{span: 7}"
      :lg="{span: 4}"
      :md="{span: 6}"
      :sm="{span: 16}"
    >
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <span>결과 <small>(적중률은 평타 / 스킬로 계산됨)</small></span>
          </div>
        </template>
        <div class="contents">
          <el-form :inline="true" size="mini" label-position="top">
            <el-form-item>
              <template #label>동일 레벨 적중률</template>
              <span class="rate"
                >{{ hitRateAvg }} / {{ hitRateSkill }} (%)</span
              >
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="mini" label-position="top">
            <el-form-item class="mobAreaHitRate">
              <template #label
                >사냥터별 최소/최대 레벨간 적중률 ({{ mobArea }})</template
              >
              <el-row>
                <el-col>
                  <span class="rate"
                    >최소: {{ mobAreaMinLevelHitRate }} /
                    {{ mobAreaMinLevelSkillHitRate }} (%)</span
                  >
                </el-col>
                <el-col>
                  <span class="rate"
                    >최대: {{ mobAreaMaxLevelHitRate }} /
                    {{ mobAreaMaxLevelSkillHitRate }} (%)</span
                  >
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="notice">
    <el-col>업데이트 (2021-08-03)</el-col>
    <el-col>
      <ol>
        <li>
          <span>알브하임 사냥터 업데이트</span>
        </li>
      </ol>
    </el-col>
  </el-row>
  <el-row class="notice">
    <el-col>참고사항</el-col>
    <el-col>
      <ol>
        <li>
          <span
            >이 프로그램은 오딘 인벤 명중률 실험 리포트를 참고하여 만듬. 따라서,
            계산식과 기준표는 리포트에 있는것과 동일함.
            (https://www.inven.co.kr/webzine/news/?news=259851&site=odin)</span
          >
        </li>
        <li>
          <span
            >최대 명중률 88.88%, 최소 명중률 45.45%이하는 계산되지 않음.</span
          >
        </li>
        <li>
          <span
            >동일 레벨 명중률은 레벨업시 항상 감소함. 명중은 3의 배수이므로
            레벨업시 증가하는 명중외에 최소 1을 더 채워야 떨어진 명중률이
            원복됨.</span
          >
        </li>
        <li>
          <span>사냥터 선택시 사냥터별 최소~최대 레벨이 표시됨.</span>
        </li>
        <li>
          <span>스킬 적중률은 평타 적중률의 10%를 보정함.</span>
        </li>
      </ol>
    </el-col>
  </el-row>
</template>

<script>
import {onMounted, ref, reactive, toRefs} from 'vue'
import {ElMessage} from 'element-plus'
import $axios from '@/plugins/axios'

export default {
  setup() {
    const {
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
    } = calculatorService()

    const options = ref([])
    onMounted(() => {
      $axios.get('/mobAreaList.json').then(({data}) => {
        options.value = data['options']
      })
    })

    return {
      options,
      userLevel,
      userHitRate,
      userCharHitRate,
      hitRateResult,
      hitRateAvg,
      hitRateSkill,
      mobAreaMinLevelHitRate,
      mobAreaMaxLevelHitRate,
      mobAreaMinLevelSkillHitRate,
      mobAreaMaxLevelSkillHitRate,
      changeMobArea,
      reset,
      ...toRefs(state)
    }
  }
}

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
</script>
