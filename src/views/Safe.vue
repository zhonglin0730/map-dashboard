<template>
  <div class="view-container">
    <!-- 左侧控制面板 -->
    <div class="panel left-panel">
      <h2>平安建设</h2>
      <div class="control-group">
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <label>
                        <input type="checkbox" v-model="showVideos" @change="updateLayers"> 
                        <span class="group-title">视频监控</span>
                    </label>
                </div>
                <span class="count">({{ videoPoints.length }})</span>
            </div>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        @keyup.enter="handleSearch"
        placeholder="输入关键字搜索视频点位..." 
      />
      <button @click="handleSearch">搜索</button>
    </div>

    <!-- 自定义悬浮视频弹窗 -->
    <div v-if="showVideo" class="video-modal">
      <div class="modal-header">
        <h3>{{ selectedVideo.name }}</h3>
        <button class="close-btn" @click="showVideo = false">×</button>
      </div>
      <div class="modal-body">
        <div class="video-container">
           <img :src="selectedVideo.snapshot || 'https://via.placeholder.com/480x270?text=Camera+Snapshot'" alt="监控快照" />
           <div class="live-tag">LIVE</div>
        </div>
        <div class="modal-info">
          <p><strong>设备ID:</strong> {{ selectedVideo.id }}</p>
          <p><strong>状态:</strong> <span class="status-online">在线</span></p>
          <p><strong>更新时间:</strong> {{ new Date().toLocaleString() }}</p>
          <p class="desc">位置: 德令哈市重点监控防区，视野覆盖良好。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { cameraIcon } from '../utils/icons.js'
import { useMapStore } from '@/stores/mapStore'

const mapStore = useMapStore()
const searchQuery = ref('')
const showVideo = ref(false)
const selectedVideo = ref({})

const showVideos = ref(true)

const videoPoints = [
  { id: 'cam_1', lat: 37.37, lng: 97.37, name: '十字路口监控A', type: 'camera', snapshot: 'https://picsum.photos/480/270?random=cam1' },
  { id: 'cam_2', lat: 37.38, lng: 97.39, name: '广场全景球机', type: 'camera', snapshot: 'https://picsum.photos/480/270?random=cam2' }
]

const updateLayers = () => {
    mapStore.removeLayer(['video_layer'])

    if (showVideos.value) {
        mapStore.addLayer({
            id: 'video_layer',
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: videoPoints.map(p => ({
                x: p.lng,
                y: p.lat,
                name: p.name
            })), 
            point: { size: 12, color: '#3498db' },
            billboard: { 
                image: cameraIcon, 
                width: 40, 
                height: 40 
            },
            font: { 
                fontSize: 12, 
                color: '#fff',
                outlineWidth: 2,
                outlineColor: '#000',
                backgroundColor: 'transparent',
                pixelOffset: { x: 0, y: -25 }
            }
        }, videoPoints)
    }
}

// 初始别名
const initLayers = updateLayers

const handleSearch = () => {
    if(!searchQuery.value) return
    
    const target = videoPoints.find(p => p.name.includes(searchQuery.value))
    if(target) {
        // 飞行定位到位置
        // API: locate(config: {x, y, zoom...})
        mapStore.locate({ x: target.lng, y: target.lat, zoom: 16, duration: 2 })
        
        // 可选：模拟选中状态
        selectedVideo.value = target
        showVideo.value = true
    } else {
        alert('未找到相关点位')
    }
}

// Store 处理拾取逻辑，我们只需响应选择变化
watch(() => mapStore.selectedObject, (newVal) => {
    if (newVal) {
        selectedVideo.value = newVal
        showVideo.value = true
    } else {
        showVideo.value = false
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

.search-box {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem; /* 移至右侧以避免与左侧面板重叠 */
  pointer-events: auto;
  display: flex;
  background: white;
  border-radius: 0.25rem;
  padding: 0.3125rem;
  box-shadow: 0 0.125rem 0.375rem rgba(0,0,0,0.2);
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
    color: #4dd0e1; /* 平安建设页面的主题色 */
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
    accent-color: #4dd0e1;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  outline: none;
  width: 12.5rem;
}

.search-box button {
  margin-left: 0.3125rem;
  padding: 0.5rem 0.9375rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

/* 悬浮自定义弹窗 */
.video-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 31.25rem;
  background: rgba(13, 27, 65, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  backdrop-filter: blur(0.75rem);
  color: white;
  pointer-events: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.625rem 2.5rem rgba(0, 0, 0, 0.7);
}

.modal-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem 0.75rem 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #3498db;
  font-weight: 600;
}

.modal-body {
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

.video-container {
  position: relative;
  width: 100%;
  height: 16.25rem;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.video-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-tag {
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  background: rgba(255, 0, 0, 0.8);
  padding: 0.125rem 0.5rem;
  border-radius: 0.1875rem;
  font-size: 0.625rem;
  font-weight: bold;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #eee;
}

.modal-info p {
    margin: 0;
}

.desc {
    color: #ccc;
    font-size: 0.8125rem;
    margin-top: 0.3125rem;
    line-height: 1.4;
}

.status-online {
  color: #2ecc71;
}
</style>
