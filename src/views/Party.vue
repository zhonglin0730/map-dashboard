<template>
  <div class="view-container">
    <!-- 左侧控制面板 -->
    <div class="panel left-panel">
      <h2>智慧党建</h2>
      <div class="control-group">
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showParty" @change="updateLayers"> 
                        <span class="group-title title-branch">示范支部</span>
                    </label>
                </div>
                <span class="count">({{ partyPoints.length }})</span>
            </div>
        </div>
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showCenters" @change="updateLayers"> 
                        <span class="group-title title-center">党群中心</span>
                    </label>
                </div>
                <span class="count">({{ centerPoints.length }})</span>
            </div>
        </div>
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showSites" @change="updateLayers"> 
                        <span class="group-title title-site">红色阵地</span>
                    </label>
                </div>
                <span class="count">({{ sitePoints.length }})</span>
            </div>
        </div>
      </div>
    </div>

    <!-- 自定义悬浮弹窗 (居中) -->
    <div v-if="showCard" class="info-card">
      <div class="card-header">
        <h3>{{ selectedPoint.name }}</h3>
        <button class="close-btn" @click="showCard = false">×</button>
      </div>
      <div class="card-body">
        <div class="card-image" v-if="selectedPoint.image">
          <img :src="selectedPoint.image" alt="阵地照片" />
        </div>
        <div class="card-info">
          <template v-if="selectedPoint.category === 'site'">
            <p><strong>地点类别:</strong> 红色教育基地</p>
            <p><strong>开放时间:</strong> 09:00 - 17:30</p>
          </template>
          <template v-else-if="selectedPoint.category === 'center'">
            <p><strong>中心主任:</strong> {{ selectedPoint.secretary }}</p>
            <p><strong>服务人数:</strong> 覆盖周边社区</p>
          </template>
          <template v-else>
            <p><strong>党部书记:</strong> {{ selectedPoint.secretary }}</p>
            <p><strong>党员人数:</strong> {{ selectedPoint.members }} 人</p>
          </template>
          <p><strong>联系方式:</strong> 138****8888</p>
          <p class="desc">简介: {{ selectedPoint.category === 'site' ? '传承红色基因，弘扬革命精神。' : '该党组织坚持以党建促发展，积极开展各类先锋模范活动。' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { partyIcon } from '../utils/icons.js'

const mapStore = useMapStore()
const showCard = ref(false)
const selectedPoint = ref({})
const showParty = ref(true)
const showCenters = ref(true)
const showSites = ref(true)

const partyPoints = [
  { id: 'branch_1', lat: 37.368, lng: 97.360, type: 'party', name: '德令哈社区党支部', secretary: '张书记', members: 45, address: '格尔木路12号', image: 'https://picsum.photos/400/300?random=party1' },
  { id: 'branch_2', lat: 37.375, lng: 97.362, type: 'party', name: '河西街道党工委', secretary: '王主任', members: 78, address: '滨河路55号', image: 'https://picsum.photos/400/300?random=party2' },
  { id: 'branch_3', lat: 37.362, lng: 97.355, type: 'party', name: '火车站街道党工委', secretary: '刘书记', members: 62, address: '站前路08号', image: 'https://picsum.photos/400/300?random=party3' }
]

const centerPoints = [
  { id: 'center_1', lat: 37.371, lng: 97.368, type: 'party', name: '市党群服务中心', secretary: '李部长', members: 120, address: '中心广场西侧', image: 'https://picsum.photos/400/300?random=party4', category: 'center' },
  { id: 'center_2', lat: 37.358, lng: 97.364, type: 'party', name: '昆仑路党群服务站', secretary: '赵书记', members: 55, address: '昆仑路33号', image: 'https://picsum.photos/400/300?random=party5', category: 'center' }
]

const sitePoints = [
  { id: 'site_1', lat: 37.380, lng: 97.350, type: 'party', name: '革命烈士陵园', secretary: '讲解员', members: 0, address: '陵园路', image: 'https://picsum.photos/400/300?random=party6', category: 'site' },
  { id: 'site_2', lat: 37.372, lng: 97.385, type: 'party', name: '红旗渠纪念馆', secretary: '讲解员', members: 0, address: '滨河路东段', image: 'https://picsum.photos/400/300?random=party7', category: 'site' }
]

const updateLayers = () => {
    mapStore.removeLayer(['branch_layer', 'center_layer', 'site_layer'])

    if (showParty.value) {
        mapStore.addLayer({
            id: 'branch_layer',
            type: 'point',
            list: partyPoints.map(p => ({ x: p.lng, y: p.lat, name: p.name })),
            billboard: { image: partyIcon, width: 36, height: 36 },
            font: { fontSize: 12, color: '#fff', outlineWidth: 2, outlineColor: '#000', pixelOffset: { x: 0, y: -20 } }
        }, partyPoints)
    }

    if (showCenters.value) {
        mapStore.addLayer({
            id: 'center_layer',
            type: 'point',
            list: centerPoints.map(p => ({ x: p.lng, y: p.lat, name: p.name })),
            billboard: { image: partyIcon, width: 44, height: 44 }, // 中心略大
            font: { fontSize: 13, color: '#fff', outlineWidth: 2, outlineColor: '#000', pixelOffset: { x: 0, y: -25 } }
        }, centerPoints)
    }

    if (showSites.value) {
        mapStore.addLayer({
            id: 'site_layer',
            type: 'point',
            list: sitePoints.map(p => ({ x: p.lng, y: p.lat, name: p.name })),
            billboard: { image: partyIcon, width: 40, height: 40 },
            font: { fontSize: 12, color: '#fff', outlineWidth: 2, outlineColor: '#000', pixelOffset: { x: 0, y: -22 } }
        }, sitePoints)
    }
}

// 初始别名
const initLayers = updateLayers

watch(() => mapStore.selectedObject, (newVal) => {
    if (newVal && newVal.type === 'party') {
        selectedPoint.value = newVal
        showCard.value = true
    } else {
        showCard.value = false
    }
})

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

onUnmounted(() => {
    mapStore.clearAllLayers()
})
</script>

<style scoped>
.view-container {
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
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
  position: absolute;
  left: 1.25rem;
  top: 1.25rem;
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
.title-branch, .title-center, .title-site { color: #ff5252; }

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
    accent-color: #ff5252;
}

/* 悬浮自定义卡片 - 弹窗样式 */
.info-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18.75rem;
  background: rgba(13, 27, 65, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  color: #ff4d4f;
  font-weight: 600;
}

.card-body {
  padding: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}
.close-btn:hover { color: #fff; }

.card-image {
  width: 100%;
  height: 11.25rem;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #eee;
}

.card-info p {
    margin: 0;
}

.desc {
    color: #ccc;
    font-size: 0.8125rem;
    margin-top: 0.3125rem;
    line-height: 1.4;
}
</style>
