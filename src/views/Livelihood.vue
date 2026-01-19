<template>
  <div class="view-container">
    <!-- 左侧控制面板 -->
    <div class="panel left-panel">
      <h2>民生服务</h2>
      <div class="control-group">
        <!-- 文体场馆 -->
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showCulture" @change="updateLayers"> 
                        <span class="group-title title-culture">文体场馆</span>
                    </label>
                </div>
                <span class="count">({{ culturePoints.length }})</span>
            </div>
        </div>
        
        <!-- 教育机构 -->
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showEducation" @change="updateLayers"> 
                        <span class="group-title title-edu">教育机构</span>
                    </label>
                </div>
                <span class="count">({{ educationPoints.length }})</span>
            </div>
        </div>

        <!-- 医疗机构 -->
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showMedical" @change="updateLayers"> 
                        <span class="group-title title-medical">医疗机构</span>
                    </label>
                </div>
                <span class="count">({{ medicalPoints.length }})</span>
            </div>
        </div>
      </div>
    </div>

    <!-- 右侧图表面板 (文旅) -->
    <div class="panel right-panel" v-if="showChartPanel">
      <div class="panel-header">
        <h2>{{ selectedPoint.name }} - 数据分析</h2>
        <button class="close-btn" @click="showChartPanel = false">×</button>
      </div>
      <div class="panel-content">
          <div class="info-block">
              <img :src="selectedPoint.image" class="thumb-img" />
              <p class="intro-text"><strong>简介：</strong>这里是德令哈市重要的{{ selectedPoint.type === 'culture' ? '文体' : '' }}活动场所，设施完善，服务优良。</p>
          </div>
          <div ref="chartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 中央信息卡片 (体育/医疗) -->
    <div v-if="showInfoCard" class="info-card">
      <div class="card-header">
        <h3>{{ selectedPoint.name }}</h3>
        <button class="close-btn" @click="showInfoCard = false">×</button>
      </div>
      <div class="card-body">
        <div class="card-image" v-if="selectedPoint.image">
          <img :src="selectedPoint.image" alt="现场照片" />
        </div>
        <div class="card-info">
          <p><strong>类型:</strong> {{ getTypeName(selectedPoint.type) }}</p>
          <p><strong>开放时间:</strong> 09:00 - 18:00</p>
          <p class="desc">简介: {{ selectedPoint.desc || '该机构致力于为市民提供优质的公共服务，环境优美，设施齐全。' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useMapStore } from '@/stores/mapStore'
import { cultureIcon, sportIcon, medicalIcon, educationIcon } from '../utils/icons.js'

const mapStore = useMapStore()
const chartRef = ref(null)
const selectedPoint = ref({})
let chartInstance = null

// UI 状态
const showCulture = ref(true)
const showEducation = ref(true)
const showMedical = ref(true)

const showChartPanel = ref(false) // 文体点位 (右侧面板)
const showInfoCard = ref(false)   // 教育/医疗点位 (中央卡片)

// 模拟数据
const culturePoints = [
  { id: 'cul_1', lat: 37.370, lng: 97.370, type: 'culture', name: '市文化馆', image: 'https://picsum.photos/400/300?random=cul1' },
  { id: 'cul_2', lat: 37.375, lng: 97.378, type: 'culture', name: '图书馆', image: 'https://picsum.photos/400/300?random=cul2' },
  { id: 'cul_3', lat: 37.365, lng: 97.380, type: 'culture', name: '奥林匹克体育中心', image: 'https://picsum.photos/400/300?random=sport1' },
  { id: 'cul_4', lat: 37.362, lng: 97.372, type: 'culture', name: '市民健身广场', image: 'https://picsum.photos/400/300?random=cul4' }
]

const educationPoints = [
  { id: 'edu_1', lat: 37.368, lng: 97.365, type: 'education', name: '迪潽幼儿园', subType: '幼儿园', image: 'https://picsum.photos/400/300?random=edu1' },
  { id: 'edu_2', lat: 37.372, lng: 97.362, type: 'education', name: '德令哈市第一小学', subType: '小学', image: 'https://picsum.photos/400/300?random=edu2' },
  { id: 'edu_3', lat: 37.378, lng: 97.360, type: 'education', name: '德令哈高级中学', subType: '中学', image: 'https://picsum.photos/400/300?random=edu3' },
  { id: 'edu_4', lat: 37.382, lng: 97.368, type: 'education', name: '柴达木职业技术学院', subType: '高等院校', image: 'https://picsum.photos/400/300?random=edu4' }
]

const medicalPoints = [
  { id: 'med_1', lat: 37.366, lng: 97.358, type: 'medical', name: '德令哈市人民医院', image: 'https://picsum.photos/400/300?random=med1' },
  { id: 'med_2', lat: 37.374, lng: 97.364, type: 'medical', name: '德令哈中心卫生院', image: 'https://picsum.photos/400/300?random=med2' },
  { id: 'med_3', lat: 37.360, lng: 97.375, type: 'medical', name: '妇幼保健院', image: 'https://picsum.photos/400/300?random=med3' },
  { id: 'med_4', lat: 37.355, lng: 97.368, type: 'medical', name: '河西街道社区卫生服务中心', image: 'https://picsum.photos/400/300?random=med4' }
]

// 添加图层
const updateLayers = () => {
    mapStore.removeLayer(['layer_culture', 'layer_medical', 'layer_education'])
    
    // 1. 文体场馆
    if (showCulture.value) {
        mapStore.addLayer({
            id: 'layer_culture',
            type: 'point',
            list: culturePoints.map(p => ({
                x: p.lng,
                y: p.lat,
                name: p.name
            })),
            billboard: { image: cultureIcon, width: 40, height: 40 },
            font: { fontSize: 14, color: '#fff', outlineWidth: 2, outlineColor: '#000', pixelOffset: { x: 0, y: -25 } }
        }, culturePoints)
    }

    // 2. 教育机构
    if (showEducation.value) {
        mapStore.addLayer({
            id: 'layer_education',
            type: 'point',
            list: educationPoints.map(p => ({
                x: p.lng,
                y: p.lat,
                name: p.name
            })),
            billboard: { image: educationIcon, width: 40, height: 40 },
            font: { fontSize: 14, color: '#fff', outlineWidth: 2, outlineColor: '#000', pixelOffset: { x: 0, y: -25 } }
        }, educationPoints)
    }

    // 3. 医疗机构
    if (showMedical.value) {
        mapStore.addLayer({
            id: 'layer_medical',
            type: 'point',
            list: medicalPoints.map(p => ({
                x: p.lng,
                y: p.lat,
                name: p.name
            })),
            billboard: { image: medicalIcon, width: 40, height: 40 },
            font: { fontSize: 14, color: '#fff', outlineWidth: 2, outlineColor: '#000', pixelOffset: { x: 0, y: -25 } }
        }, medicalPoints)
    }
}

// 初始别名
const initLayers = updateLayers

// 监听中心化选择
watch(() => mapStore.selectedObject, (newVal) => {
    if (newVal) {
        selectedPoint.value = newVal
        
        if (newVal.type === 'culture') {
            showInfoCard.value = false
            showChartPanel.value = true
            nextTick(() => { initChart() })
        } 
        else if (newVal.type === 'education' || newVal.type === 'medical') {
            showChartPanel.value = false
            showInfoCard.value = true
        }
        else {
            showChartPanel.value = false
            showInfoCard.value = false
        }
    } else {
        showChartPanel.value = false
        showInfoCard.value = false
    }
})

const initChart = () => {
    if (!chartRef.value) return
    if (chartInstance) chartInstance.dispose()
    
    chartInstance = echarts.init(chartRef.value)
    
    // 模拟图表数据 - 混合图表 (折线图 + 柱状图)
    const option = {
        title: [
            { text: '月度人流量趋势', left: 'center', textStyle: { color: '#fff', fontSize: 14 } },
            { text: '实时人流分布', top: '50%', left: 'center', textStyle: { color: '#fff', fontSize: 14 } }
        ],
        tooltip: { trigger: 'axis' },
        grid: [
            { top: '15%', height: '30%', left: '10%', right: '5%' }, // Top Chart
            { top: '65%', height: '30%', left: '10%', right: '5%' }  // Bottom Chart
        ],
        xAxis: [
            { type: 'category', data: ['1月','2月','3月','4月','5月','6月'], axisLabel: { color: '#ddd' }, gridIndex: 0 },
            { type: 'category', data: ['8:00','12:00','16:00','20:00','22:00'], axisLabel: { color: '#ddd' }, gridIndex: 1 }
        ],
        yAxis: [
             { type: 'value', axisLabel: { color: '#ddd' }, gridIndex: 0 },
             { type: 'value', axisLabel: { color: '#ddd' }, gridIndex: 1 }
        ],
        series: [
            // Month Trend
            { type: 'line', data: [820, 932, 901, 934, 1290, 1330], smooth: true, gridIndex: 0, itemStyle: { color: '#ffca28' } },
            // Time Distribution
            { type: 'bar', data: [50, 200, 150, 80, 20], gridIndex: 1, itemStyle: { color: '#42a5f5' } }
        ]
    }
    
    chartInstance.setOption(option)
}

onMounted(() => {
    if(mapStore.isMapLoaded) {
        initLayers()
    } else {
        const unwatch = watch(() => mapStore.isMapLoaded, (loaded) => {
            if(loaded) {
                initLayers()
                unwatch()
            }
        })
    }
})

const getTypeName = (type) => {
    switch(type) {
        case 'education': return selectedPoint.value.subType || '教育机构'
        case 'medical': return '医疗机构'
        default: return '公共设施'
    }
}

onUnmounted(() => {
    mapStore.clearAllLayers()
    if (chartInstance) chartInstance.dispose()
})
</script>

<style scoped>
.view-container {
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
}

.left-panel {
  position: absolute;
  left: 1.25rem;
  top: 1.25rem;
}

.panel {
  background: rgba(13, 27, 65, 0.85);
  color: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  width: 18.75rem;
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0.25rem 0.9375rem rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 0.9375rem;
    margin-top: 1.25rem;
}

.layer-group {
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.625rem;
}
.layer-group:last-child {
    border-bottom: none;
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3125rem 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.group-title {
    font-weight: bold;
}
.title-culture { color: #ffca28; }
.title-edu { color: #4facfe; }
.title-medical { color: #ff4757; }

.count {
    color: #aaa;
    font-size: 0.75rem;
}

label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
}

.right-panel {
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
  width: 28.125rem;
  height: 37.5rem; /* 为两个图表预留更多高度 */
  background: rgba(13, 27, 65, 0.95);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.panel-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.info-block {
    display: flex;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
    font-size: 0.8125rem;
    background: rgba(0,0,0,0.2);
    padding: 0.625rem;
    border-radius: 0.25rem;
}

.thumb-img {
    width: 5rem;
    height: 3.75rem;
    object-fit: cover;
    border-radius: 0.25rem;
}

.intro-text {
    flex: 1;
    margin: 0;
    line-height: 1.4;
    color: #ddd;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
}

.chart-container {
  flex: 1;
  width: 100%;
}

/* 悬浮自定义卡片 - 居中 */
.info-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rem;
  background: rgba(13, 27, 65, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.125);
  border-radius: 0.75rem;
  backdrop-filter: blur(0.75rem);
  color: white;
  pointer-events: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.625rem 2.5rem rgba(0, 0, 0, 0.6);
}

.card-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem 0.75rem 0 0;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #00d2ff;
  font-weight: 600;
}

.card-body {
  padding: 1rem;
}

.card-image {
  width: 100%;
  height: 9.375rem;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.625rem;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info p {
    margin: 0.3125rem 0;
    font-size: 0.875rem;
    color: #eee;
}

.desc {
    color: #ccc;
    font-size: 0.8125rem;
    margin-top: 0.625rem;
    line-height: 1.4;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 0.5rem;
}
</style>


