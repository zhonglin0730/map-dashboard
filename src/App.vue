<template>
  <div class="app-container">
    <!-- 背景地图 -->
    <MapContainer />

    <!-- 覆盖层 UI -->
    <div class="overlay-container">
      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      
      <!-- 用于测试的导航链接 -->
      <transition name="slide-up">
        <div v-if="isNavVisible" class="nav-links">
          <router-link to="/urban">城市管理</router-link> |
          <router-link to="/livelihood">民生服务</router-link> |
          <router-link to="/party">党建统领</router-link> |
          <router-link to="/safe">平安建设</router-link>
        </div>
      </transition>

      <!-- 导航显示/隐藏切换按钮 -->
      <button class="nav-toggle-btn" :class="{ 'is-hidden': !isNavVisible }" @click="isNavVisible = !isNavVisible">
        <span class="arrow">{{ isNavVisible ? '↓' : '↑' }}</span>
        <span class="text">{{ isNavVisible ? '隐藏菜单' : '显示菜单' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapContainer from '@/components/MapContainer.vue'

const isNavVisible = ref(true)
</script>

<style>
/* 响应式基础：根据视口宽度动态调整根字体大小 */
/* 假设 1920px 宽度下，1rem = 16px (0.833vw) */
/* 使用 clamp 限制最小和最大缩放，防止在大屏或窄屏下过于夸张 */
:root {
  font-size: clamp(12px, 0.833vw, 24px);
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}
</style>

<style scoped>
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* 允许点击通过空白区域渗透到地图 */
}

/* 在特定组件中处理标题栏和视图面板的点击事件重新启用 */

.content-area {
  flex: 1;
  position: relative;
}

.nav-links {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 0.625rem 1.25rem;
  border-radius: 1.25rem;
  pointer-events: auto;
  z-index: 10;
  backdrop-filter: blur(0.25rem);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin: 0 0.625rem;
  font-size: 1rem;
  transition: color 0.3s;
}

.nav-links a.router-link-active {
  color: #42b883;
  font-weight: bold;
}

/* 导航切换按钮样式 */
.nav-toggle-btn {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.625rem;
  border-radius: 0.625rem;
  font-size: 0.75rem;
  cursor: pointer;
  pointer-events: auto;
  z-index: 11;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-toggle-btn:hover {
  background: rgba(66, 184, 131, 0.8);
  color: white;
  bottom: 0.625rem;
}

.nav-toggle-btn.is-hidden {
  bottom: 1.25rem;
}

.nav-toggle-btn .arrow {
  transition: transform 0.3s ease;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<!-- 用于抑制原生地图 UI 的全局样式 -->
<style>
/* 以最大特异性强制隐藏原生地图弹窗/信息窗口 */
.bubble,
div.bubble,
[class*="bubble"],
.panel-menus-box,
div.panel-menus-box,
[class*="panel-menus-box"],
[data-v-5f0e1832].bubble,
[data-v-5f0e1832].panel-menus-box {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
