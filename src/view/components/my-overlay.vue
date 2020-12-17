<template>
  <bm-overlay
    ref="customOverlay"
    class="sample active"
    pane="labelPane"
    @draw="draw" :title="title">
	<img :src="iconImg" width="100%" height="100%" @click="handlerClick"/>
  </bm-overlay>
</template>

<script>
export default {
  props: ['position', 'title','iconImg','markerIndex','markerPath'],
	data(){
		return{
		}
	},
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
		handlerClick(){
			this.$emit('handler-click',this.markerPath)
		},
    draw ({el, BMap, map}) {
      const {lng, lat} = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 16 + 'px'
      el.style.top = pixel.y - 16 + 'px'
    }
  }
}
</script>

<style>
.sample {
  width: 1.875rem;
  height: 1.875rem;
  line-height: 1.875rem;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  box-shadow: 0 0 5px #000;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  /* padding: 10px; */
  position: absolute;
}
.sample .active {
  background: rgba(0,0,0,0.75);
  color: #fff;
}
</style>