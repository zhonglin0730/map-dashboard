<template>
  <div class="title-bar">
    <h1>指挥大屏标题栏</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
.title-bar {
  width: 100%;
  height: var(--title-height);
  background: rgba(13, 27, 65, 0.8);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  pointer-events: auto; /* Ensure header is clickable if needed */
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
