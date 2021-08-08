<template>
  <el-row :gutter="20">
    <el-col :span="10" :offset="10">
      <img src="http://odin-tracker.kr/logo.png" />
    </el-col>
    <el-col
      class="mt-20"
      :xl="{span: 12}"
      :lg="{span: 4}"
      :md="{span: 6}"
      :sm="{span: 16}"
      :offset="6"
    >
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <span>캐릭터 정보</span>
            <!-- <small>개발자: (오딘05/젠붕이) | 문의 사항은 인벤쪽지로</small> -->
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
        </el-form>
        <div class="divider"></div>
        <el-form
          :inline="true"
          class="statForm"
          size="mini"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col>
              <div class="resultLabel">결과</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item>
                <template #label>동일 레벨 적중률</template>
                <span class="font-20"
                  >{{ hitRateAvg }} / {{ hitRateSkill }} %</span
                >
              </el-form-item>
              <el-form-item>
                <template #label>사냥터별 적중률 (최소 레벨)</template>
                <span class="font-20"
                  >{{ mobAreaMinLevelHitRate }} /
                  {{ mobAreaMinLevelSkillHitRate }} %</span
                >
              </el-form-item>
              <el-form-item>
                <template #label>사냥터별 적중률 (최대 레벨)</template>
                <span class="font-20"
                  >{{ mobAreaMaxLevelHitRate }} /
                  {{ mobAreaMaxLevelSkillHitRate }} %</span
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card style="margin-top:10px">
        <small>만든이: 오딘05 / 젠붕이</small>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {onMounted, ref, toRefs, watch} from 'vue'
import $axios from '@/plugins/axios'
import CalculatorService from './service/calculatorService'

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
    } = CalculatorService()

    const options = ref([])
    const counter = ref(null)
    watch(hitRateAvg, (value) => {
      if (value > 0) {
        startCounter()
      }
    })

    onMounted(() => {
      $axios.get('/mobAreaList.json').then(({data}) => {
        options.value = data['options']
      })
    })

    const startCounter = () => {}

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
      counter,
      changeMobArea,
      reset,
      ...toRefs(state)
    }
  }
}
</script>
