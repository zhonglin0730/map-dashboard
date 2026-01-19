import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
    const isMapLoaded = ref(false) // 地图引擎是否完全加载并响应初始化消息
    const isInitializing = ref(true) // 🌑 初始状态设为 true，控制加载遮罩的显示
    const mapFrame = ref(null) // 存储地图 iframe 的 DOM 引用

    // 追踪活动的图层 ID，以便轻松清除它们
    const activeLayerIds = ref(new Set())
    const lastMapEvent = ref(null)

    // 新状态重构
    const layerRegistry = ref(new Map()) // 图层 ID -> { 类型, 列表: [完整对象] }
    const selectedObject = ref(null)     // 当前选中的业务对象

    /**
     * 设置地图 iframe 元素并触发初始抑制逻辑
     * @param {HTMLIFrameElement} el - iframe DOM 元素
     */
    function setMapFrame(el) {
        mapFrame.value = el
        // ⚡ 一旦 iframe 元素绑定到 store，立即启动高频抑制循环
        if (el) {
            console.log('⚡ 地图 IFrame 已绑定，启动即时抑制循环')
            startSuppressionLoop()
        }
    }

    function setMapLoaded(status) {
        isMapLoaded.value = status
    }

    // 统一发送符合 API 格式的消息：{ action, config }
    // 从 sendAction 重命名以符合用户预期的命名
    function sendMapCommand(action, config = {}) {
        if (mapFrame.value && mapFrame.value.contentWindow) {
            console.log(`📤 Sending command: ${action}`, config)
            mapFrame.value.contentWindow.postMessage({ action, config }, '*')
        } else {
            console.warn('⚠️ Map iframe not ready when trying to send:', action)
        }
    }

    // 如果其他地方需要，保留 sendAction 作为兼容性别名
    const sendAction = sendMapCommand

    function handleMapMessage(msg) {
        const { action, type, config, data } = msg
        const eventType = action || type
        const eventData = config || data

        // 核心增强：对任何来自地图的消息都采取抑制行动
        // 许多地图引擎会在用户操作（如点击、缩放）后重置 UI 状态
        // hideNativeToolbar() // 移除：交互时触发会导致频闪

        // 地图引擎准备就绪
        if (eventType === 'mapInitSuccess') {
            console.log('🗺️ 地图初始化成功，延迟 0.8s 发送关闭指令')
            setMapLoaded(true)

            // 延迟执行，避开地图内部的初始化重置
            setTimeout(() => {
                hideNativeToolbar()
            }, 800)
        }

        lastMapEvent.value = { type: eventType, data: eventData, timestamp: Date.now() }

        // 集中拾取逻辑
        if (['layerClick', 'markerClick', 'mapClick'].includes(eventType)) {
            pickObject(eventType, eventData)
        }
    }

    /**
     * 强化版多阶段抑制循环：旨在彻底解决工具栏偶尔复现的问题
     * 第 1 阶段：前 2 秒，以 50ms 极高频率压制初始闪烁
     * 第 2 阶段：后 3 秒，以 200ms 中频持续观察防止引擎重置 UI
     */
    /**
     * 策略调整：使用 1秒 稳定心跳
     * - 移除交互触发（解决闪烁）
     * - 移除双指令（解决开关冲突）
     * - 1秒频率：平衡响应速度和性能
     */
    /**
     * 策略调整：事件驱动 + 延迟关闭
     * 不再盲目猜测时间，而是等待地图发送 'mapInitSuccess' 信号。
     * 收到信号后延迟 800ms 发送一次关闭指令。
     */
    function startSuppressionLoop() {
        console.log('🚀 抑制策略转为事件驱动 (等待 mapInitSuccess)')
        isInitializing.value = true

        // 3秒后无论是否收到信号都移除遮罩，避免死锁
        setTimeout(() => {
            isInitializing.value = false
        }, 3000)
    }

    /**
     * 发送隐藏原生工具栏的指令
     * 仅发送厂商文档中的拼写 'toogletool'，避免冲突
     */
    function hideNativeToolbar() {
        if (!mapFrame.value) return
        sendMapCommand('toogletool', { visible: false })
    }

    /**
     * 通用拾取逻辑：MapClick 使用邻近匹配，LayerClick 使用精确/元数据匹配
     */
    function pickObject(type, data) {
        if (!data) return

        const clickX = data.x
        const clickY = data.y
        const clickName = data.name

        let bestMatch = null
        let minDistance = Infinity

        // 阈值：普通地图点击使用严格阈值（避免幻影点击），显式标记点击使用宽松阈值
        const threshold = (type === 'mapClick') ? 0.0001 : 0.01

        // 遍历所有已注册的图层
        layerRegistry.value.forEach((layer, id) => {
            layer.list.forEach(item => {
                // 1. 如果可用，按名称精确匹配（对于 layerClick/markerClick 非常可靠）
                if (clickName && item.name === clickName) {
                    bestMatch = item
                    minDistance = 0
                    return // 找到精确匹配
                }

                // 2. 按坐标邻近匹配
                if (clickX !== undefined && clickY !== undefined) {
                    let itemX, itemY;
                    if (item.x !== undefined && item.y !== undefined) {
                        itemX = item.x
                        itemY = item.y
                    } else if (item.lng !== undefined && item.lat !== undefined) {
                        // 支持 lng/lat 备选
                        itemX = item.lng
                        itemY = item.lat
                    } else if (item.positions && item.positions[0] && item.positions[0][0]) {
                        // 面/线数据 - 针对第一个顶点进行检查
                        itemX = item.positions[0][0][0]
                        itemY = item.positions[0][0][1]
                    }

                    if (itemX !== undefined && itemY !== undefined) {
                        const dist = Math.sqrt(Math.pow(itemX - clickX, 2) + Math.pow(itemY - clickY, 2))
                        if (dist < minDistance) {
                            minDistance = dist
                            bestMatch = item
                        }
                    }
                }
            })
        })

        if (bestMatch && minDistance < threshold) {
            selectedObject.value = bestMatch
        } else if (type === 'mapClick') {
            selectedObject.value = null
        }
    }

    /**
     * 根据 API 规范添加图层。
     * @param {Object} config - { id, type, list, ... }
     * @param {Array} [fullDataList=null] - 可选：图层的完整、未经裁剪的数据列表。
     */
    function addLayer(config, fullDataList = null) {
        if (!mapFrame.value) return

        // 稳健地抑制此图层的任何原生信息窗口
        // 尝试不同地图引擎使用的所有可能的属性名称
        config.infoWindow = false
        config.showInfoWindow = false
        config.pop = false
        config.isPop = false
        config.isInfo = false
        config.showPopup = false
        config.enablePopup = false
        config.popup = false           // 备选拼写
        config.tooltip = false         // 提示框变体
        config.enableClick = false     // 点击抑制
        config.clickable = false       // 备选点击控制
        config.disableClick = true     // 显式禁用
        config.interactive = true      // 确保如果需要，我们仍然能获取点击事件

        // 确保 ID 存在或使用提供的 ID
        if (!config.id) {
            // 注意：API 预期有 ID。如果未提供，我们会生成一个，但如果无法跟踪它则存在风险。
            // 最佳实践：调用者提供 ID。
            config.id = Date.now() + Math.random().toString(36).substr(2, 5)
        }

        // 更新注册表
        // 我们在这里存储完整的数据列表，用于高保真弹窗
        // 如果未提供 fullDataList，则使用配置中的裁剪列表
        const registryData = fullDataList || config.list
        layerRegistry.value.set(config.id, { type: config.type, list: registryData })

        activeLayerIds.value.add(config.id)
        sendAction('addlayer', config)
        return config.id
    }

    /**
     * 按 ID 移除图层。
     * @param {Array|String|Number} ids - 单个 ID 或 ID 数组
     */
    function removeLayer(ids) {
        const idList = Array.isArray(ids) ? ids : [ids]
        idList.forEach(id => {
            activeLayerIds.value.delete(id)
            layerRegistry.value.delete(id)
        })
        sendAction('removelayer', { ids: idList })
    }

    function clearAllLayers() {
        if (activeLayerIds.value.size === 0) return

        activeLayerIds.value.clear()
        layerRegistry.value.clear()
        selectedObject.value = null
        sendAction('removelayer', {}) // 发送空配置以清除地图上的所有图层
        lastMapEvent.value = null
    }

    /**
     * 定位/飞行到位置
     * @param {Object} config - { x, y, zoom, pitch, heading, duration }
     */
    function locate(config) {
        sendAction('locate', {
            x: config.lng || config.x, // 同时支持 lng/lat 和 x/y
            y: config.lat || config.y,
            zoom: config.zoom,
            pitch: config.pitch,
            heading: config.heading,
            duration: config.duration
        })
    }

    // 绘制动作
    function startDraw(type, color = '#f00') {
        sendAction('draw', { type, color })
    }

    function clearDraw(type) {
        sendAction('cleardraw', { type })
    }

    return {
        isMapLoaded,
        activeLayerIds,
        lastMapEvent,
        selectedObject, // 暴露选中的对象
        isInitializing, // 暴露初始化状态
        setMapFrame,
        setMapLoaded,
        handleMapMessage,
        addLayer,
        removeLayer,
        clearAllLayers,
        locate,
        sendAction: sendMapCommand,
        startDraw,
        clearDraw,
        hideNativeToolbar,
        startSuppressionLoop  // 如果需要显式使用，则暴露
    }
}
)
