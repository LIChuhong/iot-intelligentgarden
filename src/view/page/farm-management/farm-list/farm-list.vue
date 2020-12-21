<template>
	<div style="height: 100%;overflow: hidden;">
		<!-- <sf-model :sf-rtu-number="100000"></sf-model> -->
		<div v-show="!editor" ref="maps1" style="height:100%;position: relative;overflow: hidden;background: #dcdee2;">
			<!-- <div ref="map1" > -->
			<div style="position: absolute;top:0;left:0;z-index: 100;width: 100%;text-align: center;color: red">{{mapName}}</div>
			<div :style="mapStyle" @mousewheel="mouseWheel" @mousedown="mousedownView" @touchstart="touchstartView" id="mapBgDiv1"
			 ref="mapBgDiv1">
				<img id="mapBgImg1" ref="mapBgImg1" :src="mapBgImgUrl" style="height: 100%;" draggable="false" />
				<div v-for="item in rtuImgList" :key="item.rtuNumber" class="drag1" :style="{top:item.heightScale+'%',left:item.widthScale+'%',cursor:'pointer',}"
				 :title="item.rtuNumber">
					<p class="rtuImgTitle">{{item.rtuName?item.rtuName:item.rtuDesc}}</p>
					<div @click="showVideo(item)" v-show="item.videoId > 0" class="videoTitle">
						<Icon :type="' iconfont '+item.videoIcon" />
					</div>
					<div class="rtuImgTitle2" v-if="workVideoRtuNumber == item.rtuNumber">
						<EZUIKitJs v-if="workVideoRtuNumber == item.rtuNumber && brandTag1 == 'YSY'" :et-wide-high="etWideHigh1"
						 :video-key="videoKey1"></EZUIKitJs>
						<vi-player v-if="workVideoRtuNumber == item.rtuNumber && brandTag1 == 'LCY'" :et-wide-high="etWideHigh1"
						 :video-key="videoKey1"></vi-player>
					</div>
					<Poptip :title="item.rtuNumber" @on-popper-show="getRtuDataInfo(item)" @on-popper-hide="hidePop">
						<div slot="content">
							<div style="font-size: 0.75rem; ;" v-for="(item1 , index) in parameterDataList" :key="index">
								<Icon :color="item1.iconColor" :type="' iconfont'+ ' ' +item1.iconFont" /><span>{{item1.parameterName}}:<span
									 :style="{color:item1.iconColor }">{{item1.value}}{{item1.unit}}</span></span>
							</div>
							<div v-if="iat.show">
								<div>
									<p>状态:
										<Icon :color="iat.iconColor" :type="iat.icon" />
									</p>
									<p>剩余时间:<span :style="{color:iat.iconColor}">{{iat.restTime}}秒</span></p>
									<div style="font-size: 0.75rem;" v-for="(item2 , index) in iat.parameterDataList" :key="'i'+index">
										<Icon :color="item2.iconColor" :type="' iconfont'+ ' ' +item2.iconFont" /><span>{{item2.parameterName}}:<span
											 :style="{color:item2.iconColor }">{{item2.value}}{{item2.unit}}</span></span></div>
								</div>
								<div>
									<Cascader v-model="refCas" style="display: inline-block;" :data="iat.timeList" @on-change="setRtu"
									 @on-visible-change="refreshCas">
										<Button :disabled="iat.restTime > 0" style="margin-right:0.625rem ;" type="primary" shape="circle">开</Button>
									</Cascader>
									<Button @click="setRtu1(0,false,true)" type="primary" shape="circle">关</Button>
								</div>
							</div>
						</div>
						<div class="rtuImgStyle">
							<img :src="item.rtuTypeImgUrl" class="rtu1" :alt="item.rtuNumber+item.rtuTypeName" :draggable="false" />

						</div>
					</Poptip>


				</div>
				<div v-for="item in rtuVideoList" :key="item.videoId" class="dragVideo1" :style="{top:item.y+'%',left:item.x+'%',cursor:'pointer'}">
					<div @click="showVideo(item)" class="rtuImgStyle">
						<Icon size="25" class="rtu1" :type="' iconfont '+item.typeIcon" />
					</div>
				</div>

			</div>

			<!-- </div> -->
			<div style="position: absolute;right:5%;text-align: center;top:1.25rem;z-index: 100;">
				<Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
					<Icon @click.native="handleFullscreen" color="#fff" :type="value ? 'md-contract' : 'md-expand'" :size="23"></Icon>
				</Tooltip>
				<div style="margin: 1.25rem;">
					<button class="zoom-button" @click="getRtusMapList">
						<Icon type="md-more" :size="20" color="#fff" />
					</button>
				</div>
				<div>
					<button class="zoom-button" @click="getCurRtusMap">
						<Icon type="md-refresh" :size="20" color="#fff" />
					</button>
				</div>

			</div>

			<div class="zoom-box" style="position: absolute;bottom: 3.125rem;right:5%;">

				<zoom-controller v-model="zoom" :min="100" :max="300" :step="20"></zoom-controller>
				<div style="text-align: center;margin-top:0.625rem;color: red">{{refreshDataInv}}s</div>
			</div>
			<Modal title="园区列表" v-model="showMapList" footer-hide :transfer="false">
				<Icon slot="close" type="md-close" size="30" />
				<map-list v-if="showMapList" @get-map-info="getMapInfo"></map-list>
			</Modal>
			<Modal :title="'水肥一体机'+iaSf.rtuNumber" v-model="iaSf.show" footer-hide :transfer="false">
				<Icon slot="close" type="md-close" size="30" />
				<sf-model v-if="iaSf.show" :sf-rtu-number="iaSf.rtuNumber"></sf-model>
			</Modal>
			<Modal :styles="{left:0,top:0,margin:0}" title="视频" v-model="dragModal" :draggable="true" footer-hide :transfer="false">
				<Icon slot="close" type="md-close" size="30" />
				<EZUIKitJs v-if="dragModal && brandTag == 'YSY'" :et-wide-high="etWideHigh" :video-key="videoKey"></EZUIKitJs>
				<vi-player v-if="dragModal && brandTag == 'LCY'" :et-wide-high="etWideHigh" :video-key="videoKey"></vi-player>
			</Modal>
			<Spin fix v-show="showSpin" style="background: rgba(255,255,255,0.3);">
				<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
				<div>加载中...</div>
			</Spin>

		</div>

		<farm-form v-if="editor" :mapId="mapId" @go-back="goBack" style="z-index: 100;"></farm-form>

	</div>
</template>

<script>
	import {
		on,
		off
	} from '@/libs/tools'
	import MapList from '../component/map-list.vue'
	import SfModel from '../component/sf-model.vue'
	import bg from '@/assets/images/map.jpg'
	import FarmForm from '../component/farm-form.vue'
	import EZUIKitJs from '@/view/components/EZUIKitJs.vue'
	import ViPlayer from '@/view/single-page/component/vi-player.vue'
	import {
		rtuTimeDataList
	} from '@/view/components/js/data.js'
	import {
		getTopMap,
		getMapList,
		getMap,
		getMapData
	} from '@/api/farm.js'
	import {
		getRtuData,
		setRtuData
	} from '@/api/rtu.js'
	import {
		getVideo
	} from '@/api/video.js'
	import ZoomController from '../component/zoom-controller.vue'
	import RtuTag  from '@/data/rtu-tag.js'
	export default {
		name: 'farm_list',
		components: {
			MapList,
			ZoomController,
			FarmForm,
			SfModel,
			EZUIKitJs,
			ViPlayer
		},
		data() {
			return {
				etWideHigh: {
					w: 480,
					h: 300
				},
				etWideHigh1: {
					w: 250,
					h: 120
				},
				videoKey1: '',
				videoKey: '',
				brandTag: '',
				brandTag1: '',
				dragModal: false,
				refCas: [],
				iat: {
					rtuNumber: null,
					show: false,
					iconColor: '',
					icon: '',
					restTime: 0,
					timeList: [],
					parameterDataList: []
				},
				iaSf: {
					show: false,
					rtuNumber: '',
				},
				mapName: '',
				editor: false,
				zoom: 100,
				showMapList: false,
				orgId: this.$store.state.user.userInfo.orgId,
				value: false,
				mapBgImgUrl: '',
				rtuImgList: [],
				orgTreeOffsetLeft: 0,
				orgTreeOffsetTop: 0,
				initPageX: 0,
				initPageY: 0,
				oldMarginLeft: 0,
				oldMarginTop: 0,
				canMove: false,
				mapId: null,
				checkId: null,
				showSpin: false,
				parameterDataList: [],
				mapHeight: 0,
				mapWidth: 0,
				timer: '',
				rtuVideoList: [],
				workVideoRtuNumber: 0,
				refreshDataInv: 0,
				refreshDataTime: 0,
				timer1: '',
				// showPop:null

			}
		},
		watch: {
			zoom(newVal, oldVal) {
				if (newVal < oldVal) {
					this.mapHeight = this.mapHeight * (oldVal - 20) / oldVal
				}
				if (newVal > oldVal) {
					this.mapHeight = this.mapHeight * (oldVal + 20) / oldVal
				}

			}
		},
		computed: {
			mapStyle() {
				return {
					// transform: `translate(-50%, -50%) scale(${this.zoom/100}, ${
					//      this.zoom/100
					//    })`,
					transform: `translate(-50%, -50%)`,
					height: `${this.mapHeight}px`,
					// width: `${this.mapWidth}px`,
					marginLeft: `${this.orgTreeOffsetLeft}px`,
					marginTop: `${this.orgTreeOffsetTop}px`,
				}
			},

		},

		methods: {
			showRemTime1() {
				//倒计时
				if (this.refreshDataInv == 0) {
					clearInterval(this.timer1);
					this.getMapDataMethod()
					// clearInterval(this.timer1);
				} else if (this.refreshDataInv < 0) {
					clearInterval(this.timer1);
				} else {
					this.refreshDataInv--;
				}
			},
			getMapDataMethod() {
				clearInterval(this.timer1);
				// this.refreshDataInv = this.refreshDataTime
				// this.timer1 = setInterval(this.showRemTime1, 1000);
				getMapData(this.checkId).then(res => {
					const data = res.data
					if (data.success == 1) {
						const info = data.data
						// if(data.workVideoRtuNumber>0){
						if (this.workVideoRtuNumber != info.workVideoRtuNumber && !this.dragModal) {
							if (info.workVideo) {
								this.videoKey1 = info.workVideo
								this.videoKey1.type = 'simple'
								this.brandTag1 = info.workVideo.brandTag
							}

							this.workVideoRtuNumber = info.workVideoRtuNumber
						}

						// console.log(info.workVideoRtuNumber)

						this.refreshDataInv = this.refreshDataTime
						clearInterval(this.timer1);
						this.timer1 = setInterval(this.showRemTime1, 1000);


						// }
						// this.workVideoRtuNumber = 10000


					} else {

					}
				}).catch(error => {
					alert(error)
				})
			},
			showVideo(item) {
				getVideo(item.videoId).then(res => {
					const data = res.data
					this.showIaVideoList = false
					if (data.success == 1) {
						// console.log(data)
						this.workVideoRtuNumber = 0
						var video = data.video
						this.brandTag = video.brandTag
						// this.getEtWideHigh()
						this.videoKey = video
						this.videoKey.type = 'standard'
						this.dragModal = true

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showIaVideoList = false
					alert(error)
				})

			},
			hidePop() {
				this.iat.show = false
				// this.iaSf.show = false
			},
			refreshCas(value) {
				if (!value) {
					this.refCas = []
				}
				// console.log(this.refCas)
			},
			showRemTime() {
				//倒计时
				if (this.iat.restTime <= 0) {
					this.setStateValue(0)
					clearInterval(this.timer);
				} else {
					this.iat.restTime--;

				}
			},
			setRtu(value) {
				// console.log()
				if (value != 0) {
					value = Number(value[0])
				}
				this.setRtu1(value, false, false)
			},
			setRtu1(value, forceOpen, jumpLinkage) {

				var rtuData = {
					rtuNumber: this.iat.rtuNumber,
					orderType: 2,
					parameterDataList: [{
							parameterIndex: 2,
							value: 1
						},
						{
							parameterIndex: 3,
							value: value
						},
					],
					forceOpen: forceOpen,
					jumpLinkage: jumpLinkage
				}
				// console.log(rtuData)
				this.showSpin = true
				setRtuData(rtuData).then(res => {
					const data = res.data
					this.showSpin = false
					if (data.linkageResult) {
						var linkageResult = data.linkageResult
						this.iat.parameterDataList = linkageResult.parameterDataList.map(item => {
							if (!item.warned) {
								item.iconColor = 'red'
							} else {
								item.iconColor = 'green'
							}
							return item
						})
					}
					if (data.success == 1) {
						var rtuData = data.rtuData
						var paramList = rtuData.parameterDataList
						for (var i = 0; i < paramList.length; i++) {
							if (paramList[i].parameterId == 25) {
								this.iat.restTime = paramList[i].value
								this.setStateValue(paramList[i].value)
								clearInterval(this.timer);
								this.timer = setInterval(this.showRemTime, 1000);
								if (paramList[i].value > 0) {
									this.$Message.success('开启成功')
								} else {
									this.$Message.success('关闭成功')
								}
							}
						}
					} else {
						if (data.linkageResult) {
							if (!data.linkageResult.pass) {
								this.$Modal.confirm({
									title: data.linkageResult.tips,
									// content: '<p>'+data.linkageResult.tips+'</p>',
									transfer: false,
									okText: '强制执行',
									cancelText: '取消',
									onOk: () => {
										this.setRtu1(value, true, false)
									},
									onCancel: () => {},

								});
							} else {
								this.$Message.error(data.errorMessage)
							}

						} else {
							this.$Message.error(data.errorMessage)
						}
					}
				}).catch(error => {
					this.showSpin = false
					alert(error)
				})

			},
			getRtuDataInfo(item) {
				this.parameterDataList = []
				this.iat.show = false
				// this.iaSf.show = false
				this.iat.rtuNumber = null
				if (item.rtuTypeTag == RtuTag.rtuSFTag1 || item.rtuTypeTag == RtuTag.rtuSFTag2) {
					this.iaSf.rtuNumber = item.rtuNumber
					this.iaSf.show = true
				} else {

					this.showSpin = true
					getRtuData(item.rtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							var rtuData = data.rtuData
							if (rtuData.parameterDataList != null && rtuData.parameterDataList) {
								if (rtuData.rtuTypeTag == RtuTag.rtuWTag1 || rtuData.rtuTypeTag == RtuTag.rtuWTag2) {
									this.iat.rtuNumber = rtuData.rtuNumber
								}
								this.showParamDataList(rtuData.rtuTypeTag, rtuData.parameterDataList)
							}
						} else {
							this.$Message.error(item.rtuNumber + data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}

			},
			showParamDataList(rtuTypeTag, list) {
				if (rtuTypeTag == RtuTag.rtuWSTag1 || rtuTypeTag == RtuTag.rtuWSTag2) {
					this.parameterDataList = list.map(item => {
						if (item.parameterId == 9) {
							item.iconColor = '#0187fc'
						} else if (item.parameterId == 10) {
							item.iconColor = '#16c8c4'
						} else if (item.parameterId == 11) {
							item.iconColor = '#fc9143'
						} else if (item.parameterId == 12) {
							item.iconColor = '#ffce6b'
						} else if (item.parameterId == 13) {
							item.iconColor = '#67c300'
						} else if (item.parameterId == 14) {
							item.iconColor = '#16c8c4'
						} else if (item.parameterId == 15) {
							item.iconColor = '#fc9143'
						} else if (item.parameterId == 16) {
							item.iconColor = '#ffce6b'
						} else if (item.parameterId == 17) {
							item.iconColor = '#0187fc'
						} else if (item.parameterId == 18) {
							item.iconColor = '#4ad595'
						} else {
							item.iconColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math
								.floor(Math.random() * 255) + ')'
						}
						return item
					})
				} else if (rtuTypeTag == RtuTag.rtuTTag1 || rtuTypeTag == RtuTag.rtuTTag2) {
					list.map(item => {
						if (item.parameterId == 18) {
							item.iconColor = '#0187fc'
							this.parameterDataList.push(item)
						} else if (item.parameterId == 32) {
							item.iconColor = '#8f3ef7'
							this.parameterDataList.push(item)
						} else if (item.parameterId == 33) {
							item.iconColor = '#06cce4'
							this.parameterDataList.push(item)
						} else {
							item.iconColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math
								.floor(Math.random() * 255) + ')'
						}
						return item
					})
				} else if (rtuTypeTag == RtuTag.rtuWTag1 || rtuTypeTag == RtuTag.rtuWTag2) {
					// var showRtuState = ''
					list.map(item => {
						if (item.parameterId == 25) {
							this.setStateValue(item.value)
							this.iat.show = true
							this.iat.restTime = item.value
							clearInterval(this.timer);
							this.timer = setInterval(this.showRemTime, 1000);
						}
					})
				}
			},
			setStateValue(stateValue) {
				if (stateValue > 1) {
					this.iat.icon = " iconfont icon-water_switch_opened"
					this.iat.iconColor = "#19be6b"
				} else if (stateValue == 0) {
					this.iat.icon = " iconfont icon-water_switch_closed"
					this.iat.iconColor = "#ed4014"
					this.iat.restTime = 0
				} else {
					this.iat.icon = ''
				}
			},

			goBack(val) {
				this.editor = false
			},
			touchstartView(event) {
				// console.log(event)
				this.canMove = true
				this.initPageX = event.pageX
				this.initPageY = event.pageY
				this.oldMarginLeft = this.orgTreeOffsetLeft
				this.oldMarginTop = this.orgTreeOffsetTop
				let that = this
				// on(document, 'mousemove', this.mousemoveView)
				// on(document, 'mouseup', this.mouseupView)
				document.ontouchmove = function(event) {
					console.log(event)
					if (!that.canMove) return
					const {
						pageX,
						pageY
					} = event
					that.orgTreeOffsetLeft = that.oldMarginLeft + pageX - that.initPageX
					that.orgTreeOffsetTop = that.oldMarginTop + pageY - that.initPageY
				};
				document.ontouchend = function() {
					that.canMove = false
				}

			},

			mouseWheel(event) {
				// console.log(event)
				if (event.deltaY < 0) {
					if (this.zoom > 100) {

						// this.mapHeight = this.mapHeight * (this.zoom - 20) / this.zoom
						// this.mapWidth = this.mapWidth * (this.zoom - 20) / this.zoom
						this.zoom -= 20

					}

				} else {
					if (this.zoom < 300) {
						// this.mapHeight = this.mapHeight * (this.zoom + 20) / this.zoom
						// this.mapWidth = this.mapWidth * (this.zoom + 20) / this.zoom
						this.zoom += 20

					}
				}

			},
			editorMapInfo(row) {

			},
			getMapInfo(row, val) {
				if (val == 'check') {
					this.showMapList = false
					this.checkId = row.id
					this.showMap(row.id)
				}
				if (val == 'editor') {
					this.showMapList = false
					// this.showMap(row.id)
					this.mapId = row.id
					this.editor = true
				}
				if (val == 'del') {
					if (this.checkId == row.id) {
						this.checkId = null
					}

				}

				// alert(row)
			},
			showMap(id) {
				this.resetParameters()
				// var list = []
				getMap(id).then(res => {
					const data = res.data
					this.showSpin = true
					if (data.success == 1) {
						// console.log(data)
						this.showSpin = false
						// const map = data.map
						// const iaRtuList = data.iaRtuList

						this.showVideoPostion(data.map.videoPostionList)
						this.showRtuPostion(data.map, data.iaRtuList)

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin = false
					alert(error)
				})
			},
			showRtuPostion(map, iaRtuList) {
				if (map) {
					this.mapName = map.mapName
					this.mapBgImgUrl = map.bgImgUrl
					this.refreshDataInv = map.refreshDataInv
					this.refreshDataTime = map.refreshDataInv
					this.getMapDataMethod()
					// clearInterval(this.timer1)
					// this.timer1 = setInterval(this.showRemTime1, 1000);
				}
				if (iaRtuList) {
					var list = iaRtuList
					for (var i = 0; i < list.length; i++) {
						if (list[i].videoId > 0) {
							if (list[i].videoType == 0) {
								list[i].videoIcon = 'icon-qj0'
							} else {
								list[i].videoIcon = 'icon-qj1'
							}
						} else {
							list[i].videoIcon = ''
						}
					}
					this.rtuImgList = iaRtuList
				}
			},
			showVideoPostion(list) {
				if (list) {
					for (var i = 0; i < list.length; i++) {
						list[i].typeIcon = 'icon-qj0'
						if (list[i].videoType == 1) {
							list[i].typeIcon = 'icon-qj1'
						}
					}
					this.rtuVideoList = list
				}
			},
			getRtusMapList() {
				this.showMapList = true

			},
			resetParameters() {
				this.rtuVideoList = []
				this.rtuImgList = []
				this.orgTreeOffsetLeft = 0
				this.orgTreeOffsetLeft = 0
				this.zoom = 100
			},
			getCurRtusMap() {
				this.resetParameters()
				this.$nextTick(function() {
					this.$refs.mapBgDiv1.style.height = this.$refs.maps1.clientHeight + 'px'

				})
				if (this.checkId != null) {
					this.showMap(this.checkId)
				} else {
					this.getTopMapInfo()
				}

			},
			getTopMapInfo() {
				this.resetParameters()
				this.showSpin = true
				getTopMap(this.orgId).then(res => {
					this.showSpin = false
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						if (data.map != null && data.iaRtuList != null) {
							this.checkId = data.map.id
							this.$nextTick(function() {
								this.$refs.mapBgDiv1.style.height = this.$refs.maps1.clientHeight + 'px'
								this.mapHeight = this.$refs.maps1.clientHeight
							})
							// this.getMapDataMethod()

							this.showVideoPostion(data.map.videoPostionList)
							this.showRtuPostion(data.map, data.iaRtuList)
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin = false
					alert(error)
				})
			},
			zoomOut() {

			},
			zoomIn() {

			},
			mousedownView(event) {

				this.canMove = true
				this.initPageX = event.pageX
				this.initPageY = event.pageY
				this.oldMarginLeft = this.orgTreeOffsetLeft
				this.oldMarginTop = this.orgTreeOffsetTop
				let that = this
				// on(document, 'mousemove', this.mousemoveView)
				// on(document, 'mouseup', this.mouseupView)
				document.onmousemove = function(event) {
					if (!that.canMove) return
					const {
						pageX,
						pageY
					} = event
					that.orgTreeOffsetLeft = that.oldMarginLeft + pageX - that.initPageX
					that.orgTreeOffsetTop = that.oldMarginTop + pageY - that.initPageY
				};
				document.onmouseup = function() {
					that.canMove = false
				}
			},

			handleFullscreen() {
				// let main = main.body
				let main = this.$refs.maps1
				if (this.value) {
					this.value = false
					if (document.exitFullscreen) {
						document.exitFullscreen()
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen()
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen()
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen()
					}
					// this.$refs.mapBgDiv1.style.height = this.$refs.maps1.clientHeight + 'px'


				} else {
					this.value = true
					// this.$refs.mapBgDiv1.style.height = this.$refs.maps1.clientHeight + 'px'
					if (main.requestFullscreen) {
						main.requestFullscreen()
					} else if (main.mozRequestFullScreen) {
						main.mozRequestFullScreen()
					} else if (main.webkitRequestFullScreen) {
						main.webkitRequestFullScreen()
					} else if (main.msRequestFullscreen) {
						main.msRequestFullscreen()
					}

				}

			},
		},
		created() {},
		mounted() {
			this.getTopMapInfo()
			this.iat.timeList = rtuTimeDataList
		},
		beforeDestroy() {
			clearInterval(this.timer);
			clearInterval(this.timer1);
		}

	}
</script>

<style lang="less">
	html,
	body {
		padding: 0;
		margin: 0
	}

	.trans(@duration) {
		transition:~"all @{duration} ease-in";
	}

	.rtuImgTitle {
		position: absolute;
		color: #ffffff;
		font-size: 0.5rem;
		padding: 0;
		background: rgba(255, 0, 0, 0.5);
		top: -1.125rem;
		right:-50%;
		margin: 0 auto;
		white-space: nowrap;
		text-align: center;
		min-width: 3.75rem;
	}

	.rtuImgTitle2 {
		position: absolute;
		color: #ffffff;
		font-size: 0.5rem;
		padding: 0;
		background: rgba(255, 0, 0, 0.5);
		top: -8.5rem;
		right: -6.8rem;
		white-space: nowrap;
		text-align: center;
		width: 15.625rem;
		height: 7.5rem;
		z-index: 2
	}

	.active1 {
		background: rgba(0, 0, 0, 0.5);
	}

	.videoTitle {
		position: absolute;
		color: #ffffff;
		font-size: 0.5rem;
		padding: 0;
		background: rgba(255, 0, 0, 0.5);
		top: 1rem;
		right: -1rem;
		white-space: nowrap;
		text-align: center;
		// min-width: 3.75rem;
	}

	.zoom-button {
		width: 1.875rem;
		height: 1.875rem;
		line-height: 0.625rem;
		border-radius: 50%;
		background: rgb(124, 180, 41);
		box-shadow: 0px 0.125rem 8px 0px rgba(218, 220, 223, 0.7);
		border: none;
		cursor: pointer;
		outline: none;

		&:active {
			box-shadow: 0px 0px 2px 2px rgba(218, 220, 223, 0.2) inset;
		}

		.trans(0.1s);

		&:hover {
			background: #1890ff;
			.trans(0.1s);
		}
	}


	.demo-spin-icon-load {
		animation: ani-demo-spin 1s linear infinite;


	}

	.rtu1 {
		max-width: 100%;
		max-height: 100%;
		// z-index: 2;
		// display: inline
		// -moz-transform: none;
		// -webkit-transform: none;
		// -o-transform: none;
		// -ms-transform: none;
		// transform: none;

	}

	.rtuImgStyle {
		width: 1.875rem;
		height: 1.875rem;
		background: #00BFFF;
		line-height: 1.875rem;
		background: rgba(255, 0, 0, 0.5);
		overflow: hidden;
		box-shadow: 0 0 5px #000;
		border-radius: 50%;
		color: #fff;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative
	}


	.drag1 {
		// overflow: hidden;

		position: absolute;
		// width:  2%;
		// line-height:1.875rem;
		height: 1.875rem;
		width: 1.875rem;
		-moz-transform: none;
		-webkit-transform: none;
		-o-transform: none;
		-ms-transform: none;
		transform: none;

	}

	.dragVideo1 {
		// overflow: hidden;

		position: absolute;
		// width:  2%;
		// line-height:1.875rem;
		height: 1.875rem;
		width: 1.875rem;
		-moz-transform: none;
		-webkit-transform: none;
		-o-transform: none;
		-ms-transform: none;
		transform: none;

	}

	#mapBgDiv1 {
		position: absolute;
		top: 50%;
		left: 50%;

	}
</style>
