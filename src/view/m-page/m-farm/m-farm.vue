<template>
	<div class="mFarmStyle" style="height: 100%;overflow:hidden;">
		<div style="position: absolute;top:0;left:0;z-index: 100;width: 100%;text-align: center;color: red">画面名称:{{mapName}}</div>
		<div ref="maps1" style="height:100%;position: relative;overflow:auto;background: #dcdee2;display: flex;justify-content:center">
			<!-- <div ref="map1" > -->
			<div :style="mapStyle" @touchstart="touchstartView" id="mapBgDiv1" ref="mapBgDiv1">
				<img id="mapBgImg1" ref="mapBgImg1" :src="mapBgImgUrl" style="height: 100%;" draggable="false" />
				<div v-for="item in rtuImgList" :key="item.rtuNumber" class="drag1" :style="{top:item.heightScale+'%',left:item.widthScale+'%',cursor:'pointer'}"
				 :title="item.rtuNumber">
					<p class="rtuImgStyle1">{{item.rtuDesc?item.rtuDesc:item.rtuTypeName}}</p>
					<div @click="showVideo(item)" v-show="item.videoId > 0" class="videoTitle1">
						<Icon :type="' iconfont '+item.videoIcon" />
					</div>
					<Poptip :title="item.rtuNumber" @on-popper-show="getRtuDataInfo(item)">
						<div slot="content">
							<div style="font-size: 0.75rem;" v-for="(item1 , index) in parameterDataList" :key="index">
								<Icon :color="item1.iconColor" :type="' iconfont'+ ' ' +item1.iconFont" /><span>{{item1.parameterName}}:<span
									 :style="{color:item1.iconColor }">{{item1.value}}{{item1.unit}}</span></span></div>
							<div v-if="iat.show">
								<p>状态:
									<Icon :color="iat.iconColor" :type="iat.icon" />
								</p>
								<p>剩余时间:<span :style="{color:iat.iconColor}">{{iat.restTime}}秒</span></p>
								<div style="font-size: 0.75rem;" v-for="(item2 , index) in iat.parameterDataList" :key="'i'+index">
									<Icon :color="item2.iconColor" :type="' iconfont'+ ' ' +item2.iconFont" /><span>{{item2.parameterName}}:<span
										 :style="{color:item2.iconColor }">{{item2.value}}{{item2.unit}}</span></span></div>
								<div>
									<Cascader v-model="refCas" style="display: inline-block;" :transfer="true" :data="iat.timeList" @on-change="setRtu"
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
						<Icon size="25" class="rtu" :type="' iconfont '+item.typeIcon" />
					</div>
				</div>
			</div>
		</div>
		<div style="position: absolute;right:5%;text-align: center;top:1.25rem;z-index: 100;">
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

			<zoom-controller v-model="zoom" :min="60" :max="300" :step="5"></zoom-controller>
		</div>
		<Modal title="农场列表" v-model="showMapList" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<map-list v-if="showMapList" @get-map-info="getMapInfo"></map-list>
		</Modal>
		<Modal :title="iaSf.rtuNumber" v-model="iaSf.show" footer-hide fullscreen @on-cancel="cancel">
			<Icon slot="close" type="md-close"  size="30"/>
			<sf-model v-if="iaSf.show" :sf-rtu-number="iaSf.rtuNumber"></sf-model>
		</Modal>
		<Modal v-model="showVideoInfo" title="视频详情" footer-hide fullscreen>
			<Icon slot="close" type="md-close"  size="30"/>
			<video-info :video-info="videoInfo" v-if="showVideoInfo"></video-info>
		</Modal>
		<Spin fix v-show="showSpin" style="background: rgba(255,255,255,0.3);">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>

	</div>
</template>

<script>
	import {
		on,
		off
	} from '@/libs/tools'
	import MapList from '@/view/page/farm-management/component/map-list.vue'
	import SfModel from '@/view/page/farm-management/component/sf-model.vue'
	import bg from '@/assets/images/map.jpg'
	import {
		getTopMap,
		getMapList,
		getMap
	} from '@/api/farm.js'
	import {
		getVideo
	} from '@/api/video.js'
	import {
		getRtuData,
		setRtuData
	} from '@/api/rtu.js'
	import ZoomController from '@/view/page/farm-management/component/zoom-controller.vue'
	import {
		rtuTimeDataList
	} from '@/view/components/js/data.js'
	import VideoInfo from '@/view/m-page/m-rtu/component/video-info.vue'
	export default {
		name: 'm_farm',
		components: {
			MapList,
			ZoomController,
			SfModel,
			VideoInfo
		},
		data() {
			return {
				showVideoInfo: false,
				refCas: [],
				iaSf: {
					show: false,
					rtuNumber: null,
				},
				iat: {
					rtuNumber: null,
					show: false,
					iconColor: '',
					icon: '',
					restTime: 0,
					timeList: [],
					parameterDataList: []
				},
				mapName: '',
				timer: '',
				zoom: 100,
				showMapList: false,
				orgId: this.$store.state.user.userInfo.orgId,
				mapBgImgUrl: '',
				rtuImgList: [],
				orgTreeOffsetLeft: 0,
				orgTreeOffsetTop: 0,
				initPageX: 0,
				initPageY: 0,
				oldMarginLeft: 0,
				oldMarginTop: 0,
				canMove: false,
				checkId: null,
				showSpin: false,
				parameterDataList: [],
				mapHeight: 0,
				mapWidth: 0,
				rtuVideoList: [],
				videoInfo: ''
			}
		},
		watch: {
			zoom(newVal, oldVal) {
				if (newVal < oldVal) {
					this.mapHeight = this.mapHeight * (oldVal - 5) / oldVal
				}
				if (newVal > oldVal) {
					this.mapHeight = this.mapHeight * (oldVal + 5) / oldVal
				}

			}
		},
		computed: {
			mapStyle() {
				return {
					height: `${this.mapHeight}px`,
					// width: `${this.mapWidth}px`,
					left: '0',
					marginLeft: `${this.orgTreeOffsetLeft}px`,
					marginTop: `${this.orgTreeOffsetTop}px`,
				}
			},

		},

		methods: {
			showVideo(item) {
				// console.log(item)
				getVideo(item.videoId).then(res => {
					const data = res.data
					// this.showIaVideoList = false
					if (data.success == 1) {
						// console.log(data)
						var video = data.video
						if (video.brandTag == 'YSY') {
							this.videoInfo = data.video
							this.videoInfo.presetPoint = -1
							this.showVideoInfo = true
						} else {
							this.$Message.warning('该视频暂时无法播放')
						}


					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					// this.showIaVideoList = false
					alert(error)
				})

			},
			showRtuPostion(map, iaRtuList) {
				if (map) {
					this.mapName = map.mapName
					this.mapBgImgUrl = map.bgImgUrl
				}
				if (iaRtuList) {
					var list = iaRtuList
					for (var i = 0; i < list.length; i++) {
						// list[i].visible = false
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
					// console.log(this.rtuImgList)
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
			cancel() {
				console.log(this.iaSf.show)
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

					// this.rtuImgList = list
					// console.log(this.rtuImgList)
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
									okText: '强制执行',
									cancelText: '取消',
									onOk: () => {
										this.setRtu1(value, true, false)
									},
									onCancel: () => {
									},
									
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
				// this.showSpin = true
				this.parameterDataList = []
				this.iat.show = false
				this.iaSf.show = false
				this.iat.rtuNumber = null
				if (item.rtuTypeTag == 'IA_SF_G' || item.rtuTypeTag == 'IA_SF_N') {
					this.iaSf.rtuNumber = item.rtuNumber
					this.iaSf.show = true
				} else {
					this.showSpin = true
					getRtuData(item.rtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							// console.log(data)
							// this.iaRtu = data.iaRtu
							var rtuData = data.rtuData
							if (rtuData.parameterDataList != null && rtuData.parameterDataList) {
								if (rtuData.rtuTypeTag == 'IA_W_G' || rtuData.rtuTypeTag == 'IA_W_N') {
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
				if (rtuTypeTag == 'IA_WS_G' || rtuTypeTag == 'IA_WS_N') {
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
				} else if (rtuTypeTag == 'IA_SF_G' || rtuTypeTag == 'IA_SF_N') {
					list.map(item => {
						if (item.parameterId == 20 || item.parameterId == 22 || item.parameterId == 28 || item.parameterId == 35) {
							item.icon = ' iconfont icon-ic_kqwd'
							if (item.value == 1) {
								item.value = '开'
								item.iconColor = '#00bfff'
							} else {
								item.value = '关'
								item.iconColor = 'red'
							}
							this.parameterDataList.push(item)
						} else if (item.parameterId == 25 || item.parameterId == 27 || item.parameterId == 37 || item.parameterId == 35) {
							item.icon = ' iconfont icon-ic_kqwd'
							if (item.value == 1) {
								item.value = '开'
								item.iconColor = '#00bfff'
							} else {
								item.value = '关'
								item.iconColor = 'red'
							}
							this.parameterDataList.push(item)
						}
					})

				} else if (rtuTypeTag == 'IA_T_G' || rtuTypeTag == 'IA_T_N') {
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
				} else if (rtuTypeTag == 'IA_W_G' || rtuTypeTag == 'IA_W_N') {
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
			touchstartView(event) {
				let that = this
				let x1 = 0

				if (event.touches.length <= 1) {
					this.canMove = true
					this.initPageX = event.touches[0].pageX
					this.initPageY = event.touches[0].pageY
					this.oldMarginLeft = this.orgTreeOffsetLeft
					this.oldMarginTop = this.orgTreeOffsetTop
				} else if (event.touches.length >= 2) {
					// alert(event.changedTouches[0].pageX)
					// alert(event.changedTouches[1].pageX)
					x1 = that.getDistance(event.touches[0], event.touches[1])
					// alert(x1)

				}
				document.ontouchmove = function(event) {
					if (event.touches.length == 1) {
						if (!that.canMove) return
						// that.orgTreeOffsetLeft = that.oldMarginLeft + event.touches[0].pageX - that.initPageX
						// that.orgTreeOffsetTop = that.oldMarginTop +event.touches[0].pageY - that.initPageY
					} else if (event.touches.length >= 2) {
						var x2 = that.getDistance(event.touches[0], event.touches[1])
						if (x2 > x1) {
							if (that.zoom < 300) {
								that.zoom += 5

							}
						}
						if (x2 < x1) {
							if (that.zoom > 60) {
								that.zoom -= 5
							}
						}

					}
				};
				document.ontouchend = function() {
					that.canMove = false
				}

			},
			getDistance(p1, p2) {
				var x = p2.pageX - p1.pageX,
					y = p2.pageY - p1.pageY;
				return Math.sqrt((x * x) + (y * y));
			},

			editorMapInfo(row) {

			},
			getMapInfo(row, val) {
				if (val == 'check') {
					this.showMapList = false
					this.checkId = row.id
					this.showMap(row.id)
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
				this.showSpin = true
				getMap(id).then(res => {
					const data = res.data
					this.showSpin = false
					if (data.success == 1) {
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
			getRtusMapList() {
				this.showMapList = true

			},
			resetParameters() {
				// this.mapHeight = 0
				this.orgTreeOffsetLeft = 0
				this.orgTreeOffsetLeft = 0
				// this.zoom = 100

			},
			getCurRtusMap() {
				this.resetParameters()
				this.zoom = 100
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
						if (data.map != null && data.iaRtuList != null) {
							this.$nextTick(function() {
								this.$refs.mapBgDiv1.style.height = this.$refs.maps1.clientHeight + 'px'
								this.mapHeight = this.$refs.maps1.clientHeight
							})
							this.showRtuPostion(data.map, data.iaRtuList)
							this.showVideoPostion(data.map.videoPostionList)
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

		},
		created() {},
		mounted() {
			this.getTopMapInfo()
			this.iat.timeList = rtuTimeDataList
		}
	}
</script>

<style lang="less">
	
	@media screen and (min-width:300px) and (max-width:900px) {
		.mFarmStyle .ivu-modal-body {
			padding: 0px;
		}

		html,
		body {
			padding: 0;
			margin: 0
		}

		.trans(@duration) {
			transition:~"all @{duration} ease-in";
		}

		.rtuImgStyle1 {
			position: absolute;
			color: #ffffff;
			font-size: 0.5rem;
			padding: 0;
			background: rgba(255, 0, 0, 0.5);
			top: -1.125rem;
			right: -50%;
			white-space: nowrap;
			text-align: center;
			min-width: 3.75rem;
		}

		.zoom-button {
			width: 1.875rem;
			height: 1.875rem;
			line-height: 0.625rem;
			border-radius: 50%;
			background: rgb(124, 180, 41);
			box-shadow: 0rem 0.125rem 8rem 0.125rem rgba(218, 220, 223, 0.7);
			border: none;
			cursor: pointer;
			outline: none;

			&:active {
				box-shadow: 0px 0px 0.125rem 0.125rem rgba(218, 220, 223, 0.2) inset;
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

		.videoTitle1 {
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

		.rtu1 {
			max-width: 100%;
			max-height: 100%;
			z-index: 2;

		}

		.rtuImgStyle {
			width: 1.875rem;
			height: 1.875rem;
			border-radius: 50%;
			background: #00BFFF;
			line-height: 1.875rem;
			background: rgba(255, 0, 0, 0.5);
			overflow: hidden;
			box-shadow: 0 0 0.3125rem #000;
			border-radius: 50%;
			color: #fff;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center
		}


		.drag1 {
			// overflow: hidden;
			position: absolute;
			// width:  2%;
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
			// top: 50%;
			// left: 50%;

		}


	}
</style>
