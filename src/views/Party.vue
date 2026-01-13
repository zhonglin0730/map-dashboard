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
                        <span class="group-title">示范支部</span>
                    </label>
                </div>
                <span class="count">({{ partyPoints.length }})</span>
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
          <p><strong>党部书记:</strong> {{ selectedPoint.secretary }}</p>
          <p><strong>党员人数:</strong> {{ selectedPoint.members }} 人</p>
          <p><strong>联系方式:</strong> 138****8888</p>
          <p class="desc">简介: 该党支部坚持以党建促发展，积极开展各类先锋模范活动。</p>
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

const partyPoints = [
  {
    id: 'party_1',
    lat: 37.368,
    lng: 97.365,
    type: 'party',
    name: '德令哈社区党支部',
    secretary: '张书记',
    members: 45,
    address: '格尔木路12号',
    image: 'https://picsum.photos/400/300?random=party1'
  },
  {
    id: 'party_2',
    lat: 37.375,
    lng: 97.382,
    type: 'party',
    name: '河西街道党工委',
    secretary: '王主任',
    members: 78,
    address: '滨河路55号',
    image: 'https://picsum.photos/400/300?random=party2'
  }
]


const updateLayers = () => {
    mapStore.removeLayer(['party_layer'])

    if (showParty.value) {
        mapStore.addLayer({
            id: 'party_layer',
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: partyPoints.map(p => ({
                x: p.lng,
                y: p.lat,
                name: p.name
            })),
            point: { size: 10, color: '#e74c3c' },
            billboard: { image: partyIcon, width: 40, height: 40 },
            font: { fontSize: 12, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -20 } }
        }, partyPoints)
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
    color: #ff5252; /* 智慧党建页面的主题色 */
}

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
