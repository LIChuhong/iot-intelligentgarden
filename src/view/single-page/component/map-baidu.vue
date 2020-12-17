<template>
	<div>
		<baidu-map class="bm-view" map-type="BMAP_SATELLITE_MAP" :center="center" :zoom="zoom" @ready="handler" scroll-wheel-zoom>
			<bm-polygon v-for="(path , i) in polygonPath.paths" :key="'p'+i" :path="path" :stroke-color="polygonPath.colors[i].color"
			 :fill-color="polygonPath.colors[i].color" :fill-opacity="0.5" :stroke-opacity="1" :stroke-weight="2">
			</bm-polygon>
			<!-- <bm-marker v-for="(item , i) in polygonPath.markerPaths" :key="i" :position="item.position" animation="BMAP_ANIMATION_BOUNCE" :icon="{url: item.icon, size: {width:30, height: 30}}" :title="item.label">
		</bm-marker> -->
			<my-overlay v-for="(item , i) in polygonPath.markerPaths" :key="'o'+i" :position="item.position" :title="item.label" :icon-img="item.icon" :markerPath="item" @handler-click="changePlot">
			</my-overlay>
			<bm-control anchor="BMAP_ANCHOR_BOTTOM_RIGHT">
				<Button size="small" @click="getDataMapList">选择数据画面</Button>
			</bm-control>
			<bm-marker :position="center" :title="farmAddress"></bm-marker>
		</baidu-map>
		<Modal title="选择数据画面" v-model="showDataMapList" footer-hide width="60" :transfer="false">
			<data-map-list v-if="showDataMapList" @get-data-map-info="getDataMapInfo"></data-map-list>
		</Modal>
	</div>
</template>

<script>
	import {
		getIABigDataMap,
		getDefaultIABigDataMap
	} from '@/api/plot.js'
	import DataMapList from '@/view/page/plot-management/component/data-map-list.vue'
	import MyOverlay from '@/view/components/my-overlay.vue'
	export default {
		components: {
			DataMapList,
			MyOverlay
		},
		data() {
			return {
				polygonPath: {
					colors: [],
					editing: false,
					markerPaths: [],
					paths: [], // 绘制完成后的经纬度，其实是在画的时候动态push的，因为在点击的时候触发了 paintPolygon 函数
				},
				iaBigDataMap: '',
				showDataMapList: false,
				center: {
					lng: 0,
					lat: 0
				},
				farmAddress:'',
				zoom: 1
			}
		},
		methods: {
			changePlot(item){
				// console.log(item)
				this.$emit('get-plot-data',item)
			},
			getDefaultMap() {
				this.showSpin = true
				getDefaultIABigDataMap().then(res => {
					const data = res.data
					this.showSpin = false
					if (data.success == 1) {
						this.iaBigDataMap = data.iaBigDataMap
						// this.iaBigDataMap.dataMapName = iaBigDataMap.bigDataMapName
						var openFieldFarm = this.iaBigDataMap.openFieldFarm
						// console.log(data.iaBigDataMap)
						this.$emit('get-map-data',data.iaBigDataMap)
						// this.centerPostion = openFieldFarm.centerPostion
						this.farmAddress = openFieldFarm.farmAddress;
						this.positioning(openFieldFarm.centerPostion)
				
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin = false
					alert(error)
				})
			},
			getDataMapInfo(row) {
				this.showDataMapList = false
				this.showSpin = true
				this.polygonPath.markerPaths = []
				this.polygonPath.paths = []
				this.iaBigDataMap = ''
				getIABigDataMap(row.id).then(res => {
					const data = res.data
					this.showSpin = false
					if (data.success == 1) {
						this.iaBigDataMap = data.iaBigDataMap
						// this.iaBigDataMap.dataMapName = iaBigDataMap.bigDataMapName
						var openFieldFarm = this.iaBigDataMap.openFieldFarm
						// this.centerPostion = openFieldFarm.centerPostion
						this.farmAddress = openFieldFarm.farmAddress;
						this.$emit('get-map-data',data.iaBigDataMap)
						this.positioning(openFieldFarm.centerPostion)

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin = false
					alert(error)
				})
			},
			positioning(centerPostion) {
				var that = this;
				var geco = new BMap.Geocoder();
				geco.getLocation(centerPostion, res=> {
					that.center = centerPostion //将地图的中心点更改为给定的点
					// console.log(that.iaBigDataMap.openFieldFarm)
					// console.log('11'+res)
					// that.farmAddress = res.address + '-' + res.surroundingPois[0].title;
					if (that.iaBigDataMap.openFieldFarm.iaMassifMapList != [] && that.iaBigDataMap.openFieldFarm.iaMassifMapList != null) {
						var iaMassifMapList = that.iaBigDataMap.openFieldFarm.iaMassifMapList
						for (var i = 0; i < iaMassifMapList.length; i++) {
							that.polygonPath.markerPaths.push({
								iaMassifId: iaMassifMapList[i].id,
								position: iaMassifMapList[i].cropImgPos,
								icon: iaMassifMapList[i].cropImgUrl,
								label: iaMassifMapList[i].massifName + '-' + iaMassifMapList[i].cropName
							})
						}

					}
					if (that.iaBigDataMap.openFieldFarm.iaMassifOutLineList != [] && that.iaBigDataMap.openFieldFarm.iaMassifOutLineList != null) {
						var list = that.iaBigDataMap.openFieldFarm.iaMassifOutLineList
						
						for (var i = 0; i < list.length; i++) {
							var color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(
								Math.random() * 255) + ')'
							that.polygonPath.colors.push({
									color: color
								}),
								that.polygonPath.paths.push(
									list[i].postionList
								)
						}
					}
				})
			},

			getDataMapList() {
				this.showDataMapList = true
			},
			handler({
				BMap,
				map
			}) {
				// console.log(BMap, map)
				this.center.lng = 116.404
				this.center.lat = 39.915
				this.zoom = 15
				this.getDefaultMap()
			}
		},
		created() {
			
		}
	}
</script>

<style>
	.bm-view {
		width: 100%;
		height: 100%;

	}
</style>
