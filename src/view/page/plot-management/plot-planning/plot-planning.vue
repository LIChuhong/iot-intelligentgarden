<template>
	<div style="width: 100%;height: 100%;">
		<baidu-map class="bm-view" map-type="BMAP_SATELLITE_MAP" scroll-wheel-zoom :center="center" :zoom="zoom" @ready="handler" :double-click-zoom="false" @rightclick="showInfoWindow">
			<bm-polygon v-for="(path , i) in polygonPath.paths" :key="i" :path="path" :stroke-color="polygonPath.colors[i].color"
			 :fill-color="polygonPath.colors[i].color" :fill-opacity="0.5" :stroke-opacity="1" :stroke-weight="2" @click="changePlotList"
			 :editing="true" @lineupdate="updatePolygonPath($event,i)">
			</bm-polygon>
			<bm-marker v-for="(item , i) in polygonPath.markerPaths" :key="'abc'+i" :position="item.position" :icon="{url: item.icon, size: {width:30, height: 30}}" :title="item.label" :dragging="true" @dragging="markDragging($event,i)" @click="handlerClick(item.position,i)">
				<!-- <bm-info-window title="确定删除该地块标注吗？" :show="infoWindow.show1">
					<div style="text-align: right;"><Button @click="delMaker(i)" type="primary">确定</Button></div>
				</bm-info-window> -->

			</bm-marker>
			<!-- <my-overlay v-for="(item , j) in polygonPath.markerPaths" :key="'abc'+j" :marker-index="j" :position="item.position" :title="item.label" :icon-img="item.icon" @handler-click="handlerClick" :active="active" @mouseover.native="active = true"
      @mouseleave.native="active = false"> -->
			</my-overlay>

			<bm-marker :position="center"></bm-marker>

			<bm-control anchor="BMAP_ANCHOR_TOP_RIGHT">
				<div>
					<Input readonly v-model="iaBigDataMap.bigDataMapName" search enter-button="选择" placeholder="请选择数据画面" @on-search="getDataMapList"></Input>
				</div>
				<div style="text-align: right;margin-top: 0.625rem;">
					<Button style="margin-right: 0.625rem;" icon="ios-add" @click="addPlot">添加地块</Button>
					<Button type="primary" @click="updateMassifsMap">保存</Button>
				</div>
			</bm-control>
			<bm-info-window :position="infoWindow.path" :title="infoWindow.title" :show="infoWindow.show">
				<div style="text-align: right;"><Button @click="delPolyon(infoWindow.index)" type="primary">确定</Button></div>
			</bm-info-window>
		</baidu-map>
		<Modal title="选择地块" v-model="showPlotList" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<plan-plot-list v-if="showPlotList" @get-plot-info="getPlotInfo"></plan-plot-list>
		</Modal>
		<Modal title="选择数据画面" v-model="showDataMapList" footer-hide width="60">
			<Icon slot="close" type="md-close"  size="30"/>
			<data-map-list v-if="showDataMapList" @get-data-map-info="getDataMapInfo"></data-map-list>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>

<script>
	import PlanPlotList from '../component/plan-plot-list.vue'
	import DataMapList from '../component/data-map-list.vue'
	import MyOverlay from '@/view/components/my-overlay.vue'
	import {
		getIABigDataMap,
		updateIAMassifsMap
	} from '@/api/plot.js'
	export default {
		components: {
			PlanPlotList,
			DataMapList,
			MyOverlay
		},
		data() {
			return {
				active:false,
				iaBigDataMap: '',
				map: '',
				centerPostion: '',
				keyword: '',
				showSpin: false,
				infoWindow: {
					index: null,
					path: {
						lng: '',
						lat: ''
					},
					show: false,
					title: ''
				},
				plotPath: null,
				showPlotList: false,
				dataMapName: '',
				showDataMapList: false,
				plotList: [{
					position: {
						lng: 116.404,
						lat: 39.915
					}
				}],

				polygonPath: {
					colors: [],
					editing: false,
					markerPaths: [],
					paths: [], // 绘制完成后的经纬度，其实是在画的时候动态push的，因为在点击的时候触发了 paintPolygon 函数

				},
				center: {
					lng: 0,
					lat: 0
				},
				zoom: 1,
				delIndex: null,

			}
		},

		methods: {
			// infoWindowClose(e) {
			// 	this.delIndex = null
			// 	this.infoWindow.title = ''
			// 	this.infoWindow.path = {
			// 		lng: '',
			// 		lat: ''
			// 	}
			// 	this.infoWindow.show = false
			// },
			handlerClick(postion, markerIndex) {
				
				this.delIndex = markerIndex
				this.infoWindow.index = 1
				this.infoWindow.title = '确定删除该地块标注吗？'
				this.infoWindow.path = postion
				this.infoWindow.show = true
				// console.log(this.infoWindow.path)
			},
			updateMassifsMap() {
				if (this.iaBigDataMap != '' && this.iaBigDataMap != null && this.polygonPath.paths != []) {
					var iaMassifMapDataList = []
					var markerPaths = this.polygonPath.markerPaths
					for (var i = 0; i < markerPaths.length; i++) {
						iaMassifMapDataList.push({
							iaMassifId: markerPaths[i].iaMassifId,
							cropImgPos: markerPaths[i].position
						})
					}
					var iaMassifOutLineList = []
					var paths = this.polygonPath.paths
					for (var i = 0; i < paths.length; i++) {
						iaMassifOutLineList.push({
							postionList: paths[i]
						})
					}

					var iaMassifsMap = {
						iaBigDataMapId: this.iaBigDataMap.id,
						iaMassifMapDataList: iaMassifMapDataList,
						iaMassifOutLineList: iaMassifOutLineList
					}
					console.log(iaMassifsMap)
					this.showSpin = true
					updateIAMassifsMap(iaMassifsMap).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							this.$Message.success('保存成功')
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})



				} else {
					this.$Message.warning('请先规划地块再进行保存')
				}
			},
			getDataMapInfo(row) {
				this.showDataMapList = false
				this.polygonPath.markerPaths = []
				this.polygonPath.paths = []
				this.iaBigDataMap = ''
				getIABigDataMap(row.id).then(res => {
					const data = res.data
					if (data.success == 1) {
						console.log(data)
						this.iaBigDataMap = data.iaBigDataMap
						// this.iaBigDataMap.dataMapName = iaBigDataMap.bigDataMapName
						var openFieldFarm = this.iaBigDataMap.openFieldFarm
						// this.centerPostion = openFieldFarm.centerPostion
						this.positioning(openFieldFarm.centerPostion)

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			positioning(centerPostion) {
				// let point = new BMap.Point(centerPostion.lng, centerPostion.lat);
				// this.map.centerAndZoom(point, 10)
				var that = this;
				var geco = new BMap.Geocoder();
				geco.getLocation(centerPostion, function(res) {
					// console.log(res) //内容见下图
					// that.mk.setPosition(point) //重新设置标注的地理坐标
					that.center = centerPostion //将地图的中心点更改为给定的点
					// console.log(that.iaBigDataMap.openFieldFarm)
					if (that.iaBigDataMap.openFieldFarm.iaMassifMapList != undefined) {
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
					if (that.iaBigDataMap.openFieldFarm.iaMassifOutLineList != undefined) {
						var list = that.iaBigDataMap.openFieldFarm.iaMassifOutLineList
						console.log(list)
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
						console.log(that.polygonPath.paths)
					}

					// that.form.address = res.address; //记录该点的详细地址信息
					// that.form.addrPoint = point; //记录当前坐标点
				})
			},
			getDataMapList() {
				this.showDataMapList = true
			},

			delMaker(i) {
				this.infoWindow.show1 = false
				this.polygonPath.markerPaths.splice(i, 1)

			},
			delPolyon(index) {
				if (index == 0) {
					this.polygonPath.paths.splice(this.delIndex, 1)
				} else if (index == 1) {
					this.polygonPath.markerPaths.splice(this.delIndex, 1)
				}
				this.infoWindow.show = false

			},
			ptInPolygon(point, paths) { //判断传入的points点是否在ply多边形里面，是返回true，否返回false
				// var paths = this.polygonPath.paths

				// console.log(paths)
				var resultNum = -1
				for (var i = 0; i < paths.length; i++) {
					// console.log(resultNum)
					var ply = new BMap.Polygon(paths[i])
					var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
					if (result) {
						resultNum = i
					}
				}
				return resultNum
			},
			showInfoWindow(e) {
				var resultNum = this.ptInPolygon(e.point, this.polygonPath.paths)
				if (resultNum > -1) {
					this.infoWindow.index = 0
					this.infoWindow.path = e.point
					this.delIndex = resultNum
					this.infoWindow.title = '确定删除该地块吗？'
					this.infoWindow.show = true
				}
				// console.log(a)
			},
			addPlot() {
				// console.log(this.polygonPath.colors)
				if (this.iaBigDataMap != '' && this.iaBigDataMap != null) {
					var color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(
						Math.random() * 255) + ')'
					this.polygonPath.colors.push({
							color: color
						}),
						this.polygonPath.paths.push([
							this.center,
							this.center,
							// this.center

						])
				} else {
					this.$Message.warning('请先选择数据画面！')
				}

			},
			getPlotInfo(row) {
				var x = 0,
					y = 0;
				var path = this.plotPath; //返回多边型的点数组；ply是多边形覆盖物
				for (var k = 0; k < path.length; k++) {
					x = x + parseFloat(path[k].lng);
					y = y + parseFloat(path[k].lat);
				}
				x = x / path.length;
				y = y / path.length;
				// console.log(row)
				// console.log(this.polygonPath.markerPaths)
				this.polygonPath.markerPaths.push({
					iaMassifId: row.id,
					position: {
						lng: x,
						lat: y,
					},
					icon: row.cropImgUrl,
					label: row.massifName + '-' + row.cropName

				})
				this.showPlotList = false
			},
			changePlotList(e) {
				// console.log(e.target.getPath())
				// console.log(this.polygonPath.paths)
				this.plotPath = e.target.getPath()
				// console.log(this.polygonPath.paths[0])
				this.showPlotList = true
			},

			updatePolygonPath(e, i) {
				this.polygonPath.paths[i] = e.target.getPath();

			},
			markDragging(e, i) {

				// console.log(e.point)
				this.polygonPath.markerPaths[i].position = e.point
				// console.log(this.polygonPath.markerPaths[i].position)
			},
			addPolygonPoint() {
				this.polygonPath.push({
					lng: 116.404,
					lat: 39.915
				})
			},
			handler({
				BMap,
				map
			}) {
				// console.log(BMap, map)
				this.map = BMap
				this.center.lng = 116.404
				this.center.lat = 39.915
				this.zoom = 15
			}
		}
	}
</script>

<style>
	.bm-view {
		width: 100%;
		height: 100%;
	}
</style>
