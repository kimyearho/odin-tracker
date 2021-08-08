<template>
  <info-modal
    v-if="infoModalVisible"
    append-to-body
    :is-visible="infoModalVisible"
    @close="openInfo(false)"
  />
  <div class="logo">
    <img src="http://odin-tracker.kr/logo.png" />
  </div>
  <el-row :gutter="20">
    <el-col :span="5"><div class="grid-content bg-purple"></div></el-col>
    <el-col
      class="mt-20"
      :xl="{span: 14}"
      :lg="{span: 14}"
      :md="{span: 6}"
      :sm="{span: 6}"
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
          <el-row class="width-100">
            <el-col
              :xl="{span: 6}"
              :lg="{span: 6}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
              <el-form-item>
                <template #label>레벨</template>
                <el-input-number
                  v-model="userLevel"
                  :min="1"
                  :max="90"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col
              :xl="{span: 6}"
              :lg="{span: 6}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
              <el-form-item>
                <template #label>명중</template>
                <el-input-number
                  v-model="userHitRate"
                  :min="10"
                  :max="300"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col
              :xl="{span: 6}"
              :lg="{span: 6}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
              <el-form-item>
                <template #label>추가 명중</template>
                <el-input-number
                  v-model="userCharHitRate"
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col
              :xl="{span: 6}"
              :lg="{span: 6}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
              <el-form-item>
                <template #label>사냥터 선택</template>
                <el-select
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
            </el-col>
          </el-row>
          <el-row class="width-100">
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
          <div class="resultLabel">
            결과
            <el-button
              type="text"
              icon="el-icon-info"
              circle
              @click="openInfo(true)"
            ></el-button>
          </div>
          <el-row :gutter="20" class="width-100">
            <el-col
              :xl="{span: 8}"
              :lg="{span: 8}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
              <el-form-item>
                <template #label>동일 레벨 적중률</template>
                <span class="font-20"
                  >{{ hitRateAvg }} / {{ hitRateSkill }} %</span
                >
              </el-form-item>
            </el-col>
            <el-col
              :xl="{span: 8}"
              :lg="{span: 8}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
              <el-form-item>
                <template #label>사냥터별 적중률 (최소 레벨)</template>
                <span class="font-20"
                  >{{ mobAreaMinLevelHitRate }} /
                  {{ mobAreaMinLevelSkillHitRate }} %</span
                >
              </el-form-item>
            </el-col>
            <el-col
              :xl="{span: 8}"
              :lg="{span: 8}"
              :md="{span: 24}"
              :sm="{span: 24}"
            >
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
      <el-card style="margin-top: 10px">
        <small>만든이: 오딘05 / 젠붕이</small>
      </el-card>
    </el-col>
    <el-col :span="5"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
import {onMounted, ref, toRefs} from 'vue'
import $axios from '@/plugins/axios'
import CalculatorService from './service/calculatorService'
import InfoModal from '@/components/InfoModal.vue'

export default {
  name: 'Main',
  components: {
    InfoModal
  },
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

    const infoModalVisible = ref(false)
    const options = ref([])
    const counter = ref(null)
    const openInfo = (v) => {
      infoModalVisible.value = v
    }

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
      counter,
      openInfo,
      infoModalVisible,
      changeMobArea,
      reset,
      ...toRefs(state)
    }
  }
}
</script>
