<script setup>
import { onMounted, ref } from 'vue'
import { data } from '../graph.data'

const el = ref(null)

onMounted(async () => {
  const ForceGraph = (await import('force-graph')).default

  ForceGraph()(el.value)
    .graphData(data)
    .nodeLabel('id')
    .nodeColor((node) => (node.type === 'tag' ? '#ff9800' : '#42a5f5'))
    .nodeVal((node) => (node.type === 'tag' ? 6 : 10))
    .linkColor(() => 'rgba(120, 120, 120, 0.4)')
    .linkDirectionalArrowLength(4)
    .linkDirectionalArrowRelPos(1)
    .linkDirectionalParticles(1)
    .linkDirectionalParticleWidth(2)
    .onNodeClick((node) => {
      if (node.url) {
        const base = window.location.origin
        window.location.href = node.url.startsWith('/')
          ? base + node.url
          : base + '/' + node.url
      }
    })
    .backgroundColor('rgba(0, 0, 0, 0)')
})
</script>

<template>
  <div class="graph">
    <div ref="el" style="width: 100%; height: 80vh"></div>
  </div>
</template>

<style scoped>
.graph {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}
</style>
