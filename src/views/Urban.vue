<template>
  <div class="view-container">
    <div class="panel left-panel">
      <h2>城市管理</h2>
      <div class="control-group">
        <!-- 园林绿化分组 -->
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <button class="toggle-btn" @click.stop="expandLandscaping = !expandLandscaping">
                        {{ expandLandscaping ? '−' : '+' }}
                    </button>
                    <label>
                        <input type="checkbox" v-model="showLandscaping" @change="toggleLandscapingAll"> 
                    </label>
                    <span class="group-title" @click="expandLandscaping = !expandLandscaping">园林绿化</span>
                </div>
                <span class="count">({{ landscapingCount }})</span>
            </div>
            <div class="sub-layers" v-show="expandLandscaping">
                <label>
                    <input type="checkbox" v-model="landscapingDetails.reserves"> 
                    <span>保护区</span>
                </label>
                <label>
                    <input type="checkbox" v-model="landscapingDetails.woodlands"> 
                    <span>防护林</span>
                </label>
            </div>
        </div>

        <!-- 市政设施分组 -->
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <button class="toggle-btn" @click.stop="expandMunicipal = !expandMunicipal">
                        {{ expandMunicipal ? '−' : '+' }}
                    </button>
                    <label>
                        <input type="checkbox" v-model="showMunicipal" @change="toggleMunicipalAll"> 
                    </label>
                    <span class="group-title" @click="expandMunicipal = !expandMunicipal">市政设施</span>
                </div>
                <span class="count">({{ municipalCount }})</span>
            </div>
            <div class="sub-layers" v-show="expandMunicipal">
                <label>
                    <input type="checkbox" v-model="municipalDetails.pipes"> 
                    <span>管网</span>
                </label>
                <label>
                    <input type="checkbox" v-model="municipalDetails.wells"> 
                    <span>检查井</span>
                </label>
                <label>
                    <input type="checkbox" v-model="municipalDetails.stones"> 
                    <span>道路养护</span>
                </label>
                <label>
                    <input type="checkbox" v-model="municipalDetails.bridges"> 
                    <span>桥梁</span>
                </label>
                <label>
                    <input type="checkbox" v-model="municipalDetails.others"> 
                    <span>景观/广场</span>
                </label>
            </div>
        </div>

        <!-- 随手拍事件分组 -->
        <div class="layer-group">
            <div class="group-header">
                <div class="header-left">
                    <button class="toggle-btn" @click.stop="expandEvents = !expandEvents">
                        {{ expandEvents ? '−' : '+' }}
                    </button>
                    <label>
                        <input type="checkbox" v-model="showEvents" @change="toggleEventsAll"> 
                    </label>
                    <span class="group-title title-event" @click="expandEvents = !expandEvents">随手拍事件</span>
                </div>
                <span class="count">({{ eventCount }})</span>
            </div>
            <div class="sub-layers" v-show="expandEvents">
                <label>
                    <input type="checkbox" v-model="eventDetails.pending"> 
                    <span class="status-dot pending"></span>
                    <span>待处理</span>
                </label>
                <label>
                    <input type="checkbox" v-model="eventDetails.processing"> 
                    <span class="status-dot processing"></span>
                    <span>处理中</span>
                </label>
                <label>
                    <input type="checkbox" v-model="eventDetails.completed"> 
                    <span class="status-dot completed"></span>
                    <span>已结案</span>
                </label>
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

      <!-- 事件特有主体 -->
      <div class="card-body" v-if="selectedPoint.type === 'event'">
          <div class="event-status-bar">
              <span :class="['status-badge', selectedPoint.status]">{{ getStatusLabel(selectedPoint.status) }}</span>
              <span class="report-time">{{ selectedPoint.time }}</span>
          </div>
          <div class="card-image">
            <img :src="`https://picsum.photos/400/300?random=${selectedPoint.id}`" alt="现场照片" />
          </div>
          <div class="card-info">
            <p><strong>处理单位:</strong> <span class="dept-text">{{ selectedPoint.dept }}</span></p>
            <p><strong>上报人:</strong> {{ selectedPoint.reporter }}</p>
            <p class="desc"><strong>描述:</strong> {{ selectedPoint.desc }}</p>
            <div class="timeline">
                <div class="timeline-item active">
                    <div class="node"></div>
                    <div class="label">已上报</div>
                </div>
                <div :class="['timeline-item', selectedPoint.status !== 'pending' ? 'active' : '']">
                    <div class="node"></div>
                    <div class="label">处理中</div>
                </div>
                <div :class="['timeline-item', selectedPoint.status === 'completed' ? 'active' : '']">
                    <div class="node"></div>
                    <div class="label">已办结</div>
                </div>
            </div>
          </div>
      </div>

      <!-- 标准设施主体 -->
      <div class="card-body" v-else>
        <div class="card-image" v-if="selectedPoint.image">
          <img :src="selectedPoint.image" alt="现场照片" />
        </div>
        <div class="card-info">
          <p><strong>类型:</strong> {{ getLabel(selectedPoint.type) }}</p>
          <p><strong>状态:</strong> 正常运行</p>
          <p class="desc">备注: 该点位处于实时监控中，各项指标正常。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { getUrbanData } from '@/utils/mockUrbanData'
import { treeIcon, facilityIcon, repairIcon, sewerIcon, bridgeIcon, noticePending, noticeProcessing, noticeCompleted } from '../utils/icons.js'

const mapStore = useMapStore()
const showLandscaping = ref(true)
const showMunicipal = ref(true)
const showEvents = ref(true)

// 展开状态
const expandLandscaping = ref(true)
const expandMunicipal = ref(true)
const expandEvents = ref(true)

// 详情开关
const landscapingDetails = ref({
    reserves: true,
    woodlands: true
})

const municipalDetails = ref({
    pipes: true,
    wells: true,
    stones: true,
    bridges: true,
    others: true
})

const eventDetails = ref({
    pending: true,
    processing: true,
    completed: true
})

// 全选/反选逻辑
const toggleLandscapingAll = () => {
    const val = showLandscaping.value
    landscapingDetails.value.reserves = val
    landscapingDetails.value.woodlands = val
}

const toggleMunicipalAll = () => {
    const val = showMunicipal.value
    Object.keys(municipalDetails.value).forEach(key => {
        municipalDetails.value[key] = val
    })
}

const toggleEventsAll = () => {
    const val = showEvents.value
    Object.keys(eventDetails.value).forEach(key => {
        eventDetails.value[key] = val
    })
}

// 监听子开关以更新主开关
watch(landscapingDetails, (newVal) => {
    const all = Object.values(newVal).every(v => v)
    const some = Object.values(newVal).some(v => v)
    if (all) showLandscaping.value = true
    else if (!some) showLandscaping.value = false
    
    updateLandscapingLayers()
}, { deep: true })

watch(municipalDetails, (newVal) => {
    const all = Object.values(newVal).every(v => v)
    const some = Object.values(newVal).some(v => v)
    if (all) showMunicipal.value = true
    else if (!some) showMunicipal.value = false
    
    updateMunicipalLayers()
}, { deep: true })

watch(eventDetails, (newVal) => {
    const all = Object.values(newVal).every(v => v)
    const some = Object.values(newVal).some(v => v)
    if (all) showEvents.value = true
    else if (!some) showEvents.value = false
    
    updateEventLayer()
}, { deep: true })

// 弹窗状态
const showCard = ref(false)
const selectedPoint = ref({})

// 数据状态
const mockData = getUrbanData()
const landscapingCount = computed(() => mockData.landscaping.reserves.length + mockData.landscaping.woodlands.length)
const municipalCount = computed(() => 
    mockData.municipal.pipes.length + 
    mockData.municipal.wells.length + 
    mockData.municipal.stones.length + 
    mockData.municipal.bridges.length + 
    mockData.municipal.fountains.length + 
    mockData.municipal.squares.length
)
const eventCount = computed(() => mockData.events.length)

// 类型标签辅助函数
const getStatusLabel = (status) => {
    const map = { pending: '待处理', processing: '处理中', completed: '已办结' }
    return map[status] || status
}

// Helper to label types
const pointTypeLabel = (type) => {
    const map = {
        woodland: '防护林',
        reserve: '保护区',
        pipe: '管网',
        well: '检查井',
        stone: '道路养护',
        bridge: '桥梁',
        fountain: '景观',
        square: '广场'
    }
    return map[type] || '设施'
}

// 模板中使用的类型标签别名
const getLabel = pointTypeLabel

// 图层 ID (用于清除/切换)
const layerIds = {
    landscaping: { polygon: 'ls_poly', point: 'ls_point' },
    municipal: { pipe: 'mun_pipe', well: 'mun_well', stone: 'mun_stone', bridge: 'mun_bridge', others: 'mun_others' },
    event: {
        pending: 'ev_pending',
        processing: 'ev_processing',
        completed: 'ev_completed'
    }
}

const updateLandscapingLayers = () => {
    // Force clear layers first to ensure suppression config takes effect
    mapStore.removeLayer([layerIds.landscaping.polygon, layerIds.landscaping.point])

    // 1. Reserves (Polygon)
    if (landscapingDetails.value.reserves) {
        mapStore.addLayer({
            id: layerIds.landscaping.polygon,
            type: 'polygon',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: mockData.landscaping.reserves.map(r => ({
                positions: r.positions,
                name: r.name
            })),
            polygon: { fillColor: 'rgba(34, 139, 34, 0.4)' },
            font: { fontSize: 14, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent' }
        }, mockData.landscaping.reserves) // Keep FULL metadata in store registry
    }
        
    // 2. Woodlands (Point)
    if (landscapingDetails.value.woodlands) {
        mapStore.addLayer({
            id: layerIds.landscaping.point,
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: mockData.landscaping.woodlands.map(p => ({
                x: p.x,
                y: p.y,
                name: p.name
            })), 
            point: { size: 12, color: '#2ecc71', outlineColor: '#fff' },
            billboard: { image: treeIcon, width: 32, height: 32 }, 
            font: { fontSize: 12, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -20 } }
        }, mockData.landscaping.woodlands)
    }
}

const updateMunicipalLayers = () => {
    // Force clear first
    mapStore.removeLayer([
        layerIds.municipal.pipe, 
        layerIds.municipal.well, 
        layerIds.municipal.stone, 
        layerIds.municipal.bridge, 
        layerIds.municipal.others
    ])

    // 1. Pipes (Polyline)
    if (municipalDetails.value.pipes) {
        mapStore.addLayer({
            id: layerIds.municipal.pipe,
            type: 'polyline',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: mockData.municipal.pipes.map(p => ({
                positions: p.positions,
                name: p.name
            })),
            polyline: { 
                width: 6, 
                color: '#3498db',
                lineJoin: 'round',
                lineCap: 'round'
            } // Blue lines with rounded corners
        }, mockData.municipal.pipes)
    }

    // 2. Wells (Point)
    if (municipalDetails.value.wells) {
        mapStore.addLayer({
            id: layerIds.municipal.well,
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: mockData.municipal.wells.map(p => ({
                x: p.x,
                y: p.y,
                name: p.name
            })),
            point: { size: 10, color: '#34495e' }, // Fallback
            billboard: { image: sewerIcon, width: 32, height: 32 },
            font: { fontSize: 12, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -20 } }
        }, mockData.municipal.wells)
    }

    // 3. Stones (Point) - Repairs
    if (municipalDetails.value.stones) {
        mapStore.addLayer({
            id: layerIds.municipal.stone,
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: mockData.municipal.stones.map(p => ({
                x: p.x,
                y: p.y,
                name: p.name
            })),
            point: { size: 10, color: '#e74c3c' }, // Fallback
            billboard: { image: repairIcon, width: 32, height: 32 },
            font: { fontSize: 12, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -20 } }
        }, mockData.municipal.stones)
    }
    
    // 4. Bridges
    if (municipalDetails.value.bridges) {
        mapStore.addLayer({
            id: layerIds.municipal.bridge,
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: mockData.municipal.bridges.map(p => ({
                x: p.x,
                y: p.y,
                name: p.name
            })),
            billboard: { image: bridgeIcon, width: 40, height: 40 },
            font: { fontSize: 14, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -20 } }
        }, mockData.municipal.bridges)
    }

     // 5. Others (Fountains, Squares)
    if (municipalDetails.value.others) {
        const others = [...mockData.municipal.fountains, ...mockData.municipal.squares]
        mapStore.addLayer({
            id: layerIds.municipal.others,
            type: 'point',
            infoWindow: false,
            showInfoWindow: false,
            pop: false,
            list: others.map(p => ({
                x: p.x,
                y: p.y,
                name: p.name
            })),
            point: { size: 15, color: '#9b59b6' },
            billboard: { image: facilityIcon, width: 40, height: 40 },
            font: { fontSize: 14, color: '#fff', outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -25 } }
        }, others)
    }
}

const updateEventLayer = () => {
    // Clear all event sub-layers
    mapStore.removeLayer([layerIds.event.pending, layerIds.event.processing, layerIds.event.completed])
    
    const statuses = [
        { key: 'pending', label: '待处理', icon: noticePending, color: '#ff4d4f' },
        { key: 'processing', label: '处理中', icon: noticeProcessing, color: '#ffa940' },
        { key: 'completed', label: '已办结', icon: noticeCompleted, color: '#73d13d' }
    ]

    statuses.forEach(status => {
        if (eventDetails.value[status.key]) {
            const filtered = mockData.events.filter(e => e.status === status.key)
            if (filtered.length > 0) {
                mapStore.addLayer({
                    id: layerIds.event[status.key],
                    type: 'point',
                    infoWindow: false,
                    showInfoWindow: false,
                    pop: false,
                    list: filtered.map(e => ({
                        x: e.x,
                        y: e.y,
                        name: e.name
                    })),
                    billboard: { image: status.icon, width: 40, height: 40 },
                    font: { fontSize: 13, color: status.color, outlineWidth: 2, outlineColor: '#000', backgroundColor: 'transparent', pixelOffset: { x: 0, y: -25 } }
                }, filtered)
            }
        }
    })
}

// Minimal watch: Store handles the heavy lifting
watch(() => mapStore.selectedObject, (newVal) => {
    if (newVal) {
        selectedPoint.value = newVal
        showCard.value = true
    } else {
        showCard.value = false
    }
})


watch(showLandscaping, updateLandscapingLayers)
watch(showMunicipal, updateMunicipalLayers)
watch(showEvents, updateEventLayer)


const init = () => {
    // 1. 定位到德令哈中心
    mapStore.locate({
        x: 97.3700,
        y: 37.3700,
        zoom: 13,
        pitch: 60,
        heading: 0,
        duration: 2
    })

    // 2. 添加图层
    updateLandscapingLayers()
    updateMunicipalLayers()
    updateEventLayer()
}

onMounted(() => {
  if(mapStore.isMapLoaded) {
      init()
  } else {
      const unwatch = watch(() => mapStore.isMapLoaded, (loaded) => {
          if(loaded) {
              init()
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
  padding: 1.25rem;
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
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.9375rem;
  margin-top: 1.25rem;
}

label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background 0.3s;
}

label:hover {
  background: rgba(255,255,255,0.1);
}

/* 嵌套菜单样式 */
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
    color: #00d2ff;
    cursor: pointer;
    user-select: none;
}
.title-event { color: #ffca28; }

.count {
    color: #aaa;
    font-size: 0.75rem;
}

.toggle-btn {
    border: 1px solid rgba(255,255,255,0.2); /* 添加边框以增加可见性 */
    background: rgba(255,255,255,0.05); /* 轻微背景 */
    color: #fff;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.125rem; /* 针对边框微调 */
    text-align: center;
    cursor: pointer;
    font-size: 0.875rem; /* 字号稍大 */
    padding: 0;
    transition: all 0.2s;
    border-radius: 0.25rem;
}

.toggle-btn:hover {
    color: #fff;
    transform: scale(1.2);
}

.sub-layers {
    margin-left: 1.25rem; /* 缩进二级菜单 */
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.625rem;
    padding-left: 0.625rem;
    border-left: 1px solid rgba(255,255,255,0.1);
}

.sub-layers label {
    font-size: 0.875rem;
    color: #ddd;
}

input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: #00d2ff;
}

/* 悬浮自定义弹窗 - 模态框样式 */
.info-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rem;
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
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -40%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px 12px 0 0;
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

/* 事件特有样式 */
.event-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.status-badge {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: bold;
}
.status-badge.pending { background: #ff4d4f; color: white; }
.status-badge.processing { background: #faad14; color: white; }
.status-badge.completed { background: #52c41a; color: white; }

.report-time {
    font-size: 0.75rem;
    color: #888;
}

.dept-text {
    color: #00d2ff;
    font-weight: 500;
}

.status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
}
.status-dot.pending { background: #ff4d4f; }
.status-dot.processing { background: #faad14; }
.status-dot.completed { background: #52c41a; }

.timeline {
    margin-top: 0.9375rem;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 0.625rem 0;
}
.timeline::before {
    content: '';
    position: absolute;
    top: 0.9375rem;
    left: 10%;
    right: 10%;
    height: 2px;
    background: rgba(255,255,255,0.1);
    z-index: 1;
}
.timeline-item {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33.3%;
}
.timeline-item .node {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: #444;
    margin-bottom: 0.3125rem;
    border: 2px solid #222;
}
.timeline-item.active .node {
    background: #00d2ff;
    box-shadow: 0 0 0.5rem #00d2ff;
}
.timeline-item .label {
    font-size: 0.6875rem;
    color: #666;
}
.timeline-item.active .label {
    color: #00d2ff;
}
</style>
