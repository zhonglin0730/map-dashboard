<template>
  <div class="map-container" :class="{ 'is-initializing': mapStore.isInitializing }">
    <iframe
      ref="mapIframe"
      src="https://dlhditu.hzsxkj.cn/#/"
      frameborder="0"
      width="100%"
      height="100%"
      @load="onMapLoad"
    ></iframe>
    <!-- 加载遮罩：用于在地图初始化时隐藏原生的工具栏闪烁 -->
    <div v-if="mapStore.isInitializing" class="map-mask">
      <div class="loader">
        <div class="spinner"></div>
        <span>地图资源加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMapStore } from '@/stores/mapStore'

const mapIframe = ref(null)
const mapStore = useMapStore()

/**
 * IFrame DOM 加载完成后的回调
 */
const onMapLoad = () => {
  // 将 iframe 引用传递给 store 以开始抑制逻辑
  mapStore.setMapFrame(mapIframe.value)
  console.log('地图 IFrame DOM 加载完成')
}

/**
 * 处理来自地图 IFrame 的 postMessage 消息
 */
const handleMessage = (event) => {
  if (!event.data) return
  const { action, config, type, data } = event.data

  // 处理图层引擎初始化成功动作 (Action)
  if (action) {
    if (action === 'mapInitSuccess') {
      console.log('地图引擎初始化成功 (Action)')
      mapStore.setMapLoaded(true)
    }
    mapStore.handleMapMessage({ action, config })
    return
  }

  // 处理旧版或备选初始化成功消息 (Type)
  if (type === 'mapInitSuccess') {
    console.log('地图引擎初始化成功 (Type)')
    mapStore.setMapLoaded(true)
    mapStore.handleMapMessage({ type, data })
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: #000;
  background: #000;
}

/* 初始加载时隐藏地图，防止看到工具栏闪烁 */
iframe {
  transition: opacity 0.5s ease-in-out;
  width: 100%;
  height: 100%;
  border: none;
}

.is-initializing iframe {
  opacity: 0;
}

/* 科技感加载遮罩样式 */
.map-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1a2a4a 0%, #050a1a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: #00d2ff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 210, 255, 0.1);
  border-top: 3px solid #00d2ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
