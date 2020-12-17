<template>
	<div class="map" ref="map">
		<img :src="mapBg" width="100%" height="100%" />
		<div class="titleText">
			<h2>自然农场大数据平台</h2>
		</div>
		<div class="mapContent">
			<div class="compent" style="left: 2%">
				<img src="../../../assets/images/map/warningCurve.png" class="img1" />
				<div class="title">
					<img src="../../../assets/images/map/wc.png" />
					<span style="color: #00b8ff">报警信息</span>
				</div>
				<div style="position: absolute;top:40%;width: 100%;text-align: center;color: #98b8db;">
					<p>暂无信息</p>
				</div>
			</div>
			<div class="compent" style="right: 2%;">
				<img src="../../../assets/images/map/warningCurve.png" class="img1" />
				<div class="title">
					<img src="../../../assets/images/map/wc.png" height="100%" />
					<span style="color: #00b8ff">当天空气、土壤温度变化曲线</span>
				</div>
				<div style="position: absolute;width: 100%;height: 100%;">
					<map-temper :tempColor="['#00a7fe','#3ed795','#ffce6b']" :tempData="tempData" class="curveEchart"></map-temper>
				</div>
			</div>
			<map-baidu class="curveEchart" @get-map-data="getIaMapData" @get-plot-data="getPlotData"></map-baidu>

		</div>
		<div class="publicStyle minh lDistance bTop">
			<img src="../../../assets/images/map/soil1.png" />
			<Button type="text" ghost style="z-index: 1;position: absolute;left: 0;top:0;" size="small" @click="getIaVideoList">列表</Button>
			<div class="titleImg">
				<img src="../../../assets/images/map/watch.png" />
			</div>
			<div ref="ezuikt" class="titleImg" style="overflow: hidden;display: flex;justify-content:center;top:17%;height: 83%;">
				<EZUIKitJs v-if="brandTag == 'YSY'" :et-wide-high="etWideHigh" :video-key="videoKey" :ia-video-list="iaVideoList"
				 :get-video-info="getVideoInfo"></EZUIKitJs>
				<vi-player v-if="brandTag == 'LCY'" :et-wide-high="etWideHigh" :video-key="videoKey" :get-video-info="getVideoInfo"></vi-player>
			</div>
		</div>
		<div class="publicStyle maxh lDistance bBottom">
			<img src="../../../assets/images/map/soil1.png" />
			<div class="titleImg">
				<img src="../../../assets/images/map/curve.png" />
			</div>
			<div class="titleImg" style="top:10%;height: 90%;overflow: hidden;line-height: 1;font-size: 0.625rem;">
				<div style="height: 50%;overflow: hidden;">
					<div class="curve">
						<div v-for="(item, index) in curveList" :key="'c'+index"><button @click="weatherIndex = index" :class="{btnColor1:weatherIndex == index}">{{item.title}}</button></div>
					</div>
					<div class="curve1">
						<map-bar class="curveEchart" :title-name="'近一年月平均值'" :legend-name="curveList[weatherIndex].unit?'月均值('+curveList[weatherIndex].unit+')':'月均值'"
						 :line-loading="showSpin" :bar-data="curveList[weatherIndex].hisYearList" :bar-color="'#0075ff'"></map-bar>
					</div>
					<div class="curve1">
						<map-line class="curveEchart" :line-data="curveList[weatherIndex].hisMonList" :legend-name="curveList[weatherIndex].unit?'日均值('+curveList[weatherIndex].unit+')':'日均值'"
						 :line-loading="showSpin" :title-name="'近一月日平均曲线'" :line-color="'#00a7fe'"></map-line>
					</div>
				</div>
				<div style="height: 50%;overflow: hidden;">
					<div class="curve">
						<div v-for="(item, index) in curveList1" :key="'c1'+index"><button @click="poltIndex = index" :class="{btnColor1:poltIndex == index}">{{item.title}}</button></div>
					</div>
					<div class="curve1">
						<map-line :line-data="curveList1[poltIndex].hisYearList" class="curveEchart" :title-name="'近一年月平均曲线'"
						 :line-loading="showSpin1" :legend-name="curveList1[poltIndex].unit?'月均值('+curveList1[poltIndex].unit+')':'月均值'"
						 :line-color="'#c624e6'"></map-line>
					</div>
					<div class="curve1">
						<map-line :line-data="curveList1[poltIndex].hisMonList" class="curveEchart" :title-name="'近一月日平均曲线'"
						 :line-loading="showSpin1" :legend-name="curveList1[poltIndex].unit?'日均值('+curveList1[poltIndex].unit+')':'日均值'"
						 :line-color="'#11cdab'"></map-line>
					</div>
				</div>
				<!-- </div> -->
				<!-- <Spin v-show="showSpin" fix style="background: rgba(255, 255, 255, 0.1);">
					<Icon type="ios-loading" size=20 class="demo-spin-icon-load" color="#fff"></Icon>
					<div style="color: #fff;">Loading</div>
				</Spin> -->

			</div>
		</div>
		<div class="publicStyle maxh rDistance bTop">
			<img src="../../../assets/images/map/soil1.png" />
			<Button type="text" ghost style="z-index: 1;position: absolute;right: 0;top:0;" size="small" @click="refreshDataMethod">刷新</Button>
			<div class="titleImg">
				<img src="../../../assets/images/map/weather.png" />
			</div>

			<div class="titleImg" style="top:10%;height: 90%;overflow: hidden;">

				<div v-for="(item,i) in mlList" :key="'m'+i" style="width: 50%;padding:2% 0 0 5%;overflow: hidden;float: left;height: 20%;">
					<div style="float:left;height: 100%;width: 20%;">
						<Icon :type="' iconfont'+ ' ' +item.iconFont" size="20" :color="item.iconColor" />
					</div>
					<div :title="item.parameterName+':'+item.value+item.unit" style="float: left;height: 100%;line-height: 1;width: 80%;">
						<p style="font-size: 0.75rem;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.value+item.unit}}</p>
						<p style="font-size:0.5rem;color: #31abe3;margin-top: 0.125rem;">{{item.parameterName}}</p>
					</div>
				</div>
			</div>
			<Spin v-show="showSpin" fix style="background: rgba(255, 255, 255, 0.1);">
				<Icon type="ios-loading" size=20 class="demo-spin-icon-load" color="#fff"></Icon>
				<div style="color: #fff;">Loading</div>
			</Spin>
		</div>
		<div class="publicStyle minh rDistance bBottom">
			<img src="../../../assets/images/map/soil1.png" />
			<div class="titleImg">
				<img src="../../../assets/images/map/soil.png" />
			</div>
			<div class="titleImg" style="top:10%;height: 90%;overflow: hidden;display: flex;justify-content:space-around;align-items:center">

				<div v-for="(item,i) in soilList" :key="'s'+i" style="text-align: center;line-height: 1;">
					<div style="margin-top: 35%;" :title="item.parameterName+':'+item.value+item.unit">

						<Icon :type="' iconfont'+ ' ' +item.iconFont" size="30" :color="item.iconColor" />
						<p style="font-size: 0.75rem;margin-top: 0.625rem;">{{item.value+item.unit}}</p>
						<p style="font-size:0.5rem;color: #31abe3;margin-top: 0.125rem;">{{item.parameterName}}</p>
					</div>
				</div>
			</div>
			<Spin v-show="showSpin1" fix style="background: rgba(255, 255, 255, 0.1);">
				<Icon type="ios-loading" size=20 class="demo-spin-icon-load" color="#fff"></Icon>
				<div style="color: #fff;">Loading</div>
			</Spin>
		</div>
		<div style="position: absolute;right:1.875rem;top:0.625rem">
			<Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
				<Icon @click.native="handleFullscreen" :type="value ? 'md-contract' : 'md-expand'" :size="23" style="color: #FFFFFF;z-index: 200;"></Icon>
			</Tooltip>
		</div>
		<Modal title="视频列表" v-model="showIaVideoList" footer-hide width="60" :transfer="false">
			<div style="display: flex;flex-wrap:wrap;background:#e8eaec;">
				<div style="width: 31%;margin: 1%;text-align: center;" v-for="(item,index) in iaVideoImgList" :key="'vi'+ index"
				 :title="item.channelName">
					<!-- {{iaVideoImgList[0]}} -->
					<Card shadow>
						<!-- <a style="position: absolute;right: 0;top: 0;" @click="linkDownload(item)">详情</a> -->
						<p style="color: #00BFFF;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{item.channelName}}</p>
						<img :src="item.picUrl" width="100%" @click="changeIaVideo(item)" />
					</Card>
				</div>
			</div>
		</Modal>

	</div>

</template>

<script>
	import mapBg from '@/assets/images/mapBg.png'
	import MapBar from '../component/map-bar.vue'
	import MapLine from '../component/map-line.vue'
	import MapBaidu from '../component/map-baidu.vue'
	import MapTemper from '../component/map-temper.vue'
	import EZUIKitJs from '../component/EZUIKitJs.vue'
	import ViPlayer from '../component/vi-player.vue'
	import {
		getIAVideoList,
		getMassifSoilData,
		getFarmWeatherData,
		getNearlyDayImportParaDataList
	} from '@/api/plot.js'
	import {
		getVideoByDeviceSerialChannelNo
	} from '@/api/video.js'

	export default {
		components: {
			MapBar,
			MapLine,
			MapBaidu,
			MapTemper,
			EZUIKitJs,
			ViPlayer
		},
		data() {
			return {
				etWideHigh: {
					w: 300,
					h: 100
				},
				mapBg,
				// screenWidth:null
				brandTag: '',
				showSpin: false,
				showSpin1: false,
				weatherIndex: 0,
				poltIndex: 0,
				getVideoInfo: '',
				iaVideoImgList: [],
				iaVideoList: [],
				videoKey: '',
				iaBigDataMapId: 0,
				showIaVideoList: false,
				value: false,
				mlList: [], //气象列表
				soilList: [], //土壤列表
				curveList: [{}],
				curveList1: [{}],
				mapData: '',
				wsRtuNumber: null,
				tempData: [],
			}
		},
		methods: {
			// linkDownload(item) {
			// 	// window.open(url, '_blank') // 新窗口打开外链接
			// 		getVideoByDeviceSerialChannelNo(item.deviceSerial, item.channelNo).then(res => {
			// 		const data = res.data
			// 		// this.showIaVideoList = false
			// 		if (data.success == 1) {
			// 			 console.log(data)
			// 			 var video = data.video
			// 			 if(video.brandTag == 'YSY'){
			// 				 var videoDeviceInfo = video.videoDeviceInfo
			// 				 var videoBrandAccount = video.videoBrandAccount
			// 				 var accessToken = videoBrandAccount.accessToken
			// 				 var deviceSerial = videoDeviceInfo.deviceSerial
			// 				 var channelNo = videoDeviceInfo.channelNo
			// 				 window.open('https://open.ys7.com/ezopen/h5/rec?autoplay=1&audio=1&accessToken='+accessToken+'&hd=1&deviceSerial='+deviceSerial+'&channelNo='+channelNo+'', '_blank')
			// 			 }
			// 			
			// 		} else {
			// 			this.$Message.error(data.errorMessage)
			// 		}
			// 	}).catch(error => {
			// 		// this.showIaVideoList = false
			// 		alert(error)
			// 	})
			// },

			getPlotData(item) {
				// console.log(item)
				this.getMassifSoilDataMethod(item.iaMassifId)
				this.tempData = [{
					wsRtuNumber: this.wsRtuNumber,
					iaMassifId: item.iaMassifId
				}]
			},
			refreshDataMethod() {
				this.getEtWideHigh()
				this.getIaMapData(this.mapData)
			},
			changeIaVideo(item) {
				getVideoByDeviceSerialChannelNo(item.deviceSerial, item.channelNo).then(res => {
					const data = res.data
					this.showIaVideoList = false
					if (data.success == 1) {
						// console.log(data)
						var video = data.video
						this.brandTag = video.brandTag
						this.getEtWideHigh()
						this.getVideoInfo = video

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showIaVideoList = false
					alert(error)
				})


				// console.log(this.getVideoInfo)


			},
			getEtWideHigh() {
				var w = this.$refs.ezuikt.offsetWidth
				var h = this.$refs.ezuikt.offsetHeight
				// alert(22)
				this.etWideHigh = {
					w: w,
					h: h
				}

				// alert(JSON.stringify(this.etWideHigh))
			},
			getIaMapData(mapData) {
				// console.log(1)
				// console.log(mapData)
				// console.log(this.$refs.ezuikt.offsetHeight)
				// console.log(this.$refs.ezuikt.offsetWidth)
				this.brandTag = mapData.defaultVideo.brandTag
				this.mapData = mapData
				this.weatherIndex = 0
				this.poltIndex = 0
				// console.log(this.brandTag)
				this.getEtWideHigh()
				this.videoKey = mapData.defaultVideo
				this.iaBigDataMapId = mapData.id
				if (mapData.openFieldFarm.iaMassifMapList != [] && mapData.openFieldFarm.iaMassifMapList != null) {
					var massifId = mapData.openFieldFarm.iaMassifMapList[0].id
					this.getMassifSoilDataMethod(massifId)
					this.getFarmWeatherDataMethod(this.iaBigDataMapId)

				}

			},
			getFarmWeatherDataMethod(iaBigDataMapId) { //获取农场气象数据
				this.mlList = []
				this.showSpin = true
				getFarmWeatherData(iaBigDataMapId).then(res => {
					const data = res.data
					this.showSpin = false
					if (data.success == 1) {
						// alert(JSON.stringify(data))
						// console.log(data)
						if (data.rtuData != '' && data.rtuData != null) {
							// alert(1)
							const rtuData = data.rtuData
							this.wsRtuNumber = rtuData.rtuNumber
							// this.getNearDayFarmDataMethod(this.wsRtuNumber,this.mapData.openFieldFarm.iaMassifMapList[0].id)
							this.tempData = [{
								wsRtuNumber: this.wsRtuNumber,
								iaMassifId: this.mapData.openFieldFarm.iaMassifMapList[0].id
							}]

							this.showWeatherDataMethod(rtuData)
						}
						if (data.rtuHistoryNearlyMonthDataList != null && data.rtuHistoryNearlyYearDataList.length != null) {
							// alert(1)
							var paraNameList = data.paraNameList
							// this.curveList1 = data.paraNameList
							var monList = []
							var yearList = []
							monList = data.rtuHistoryNearlyMonthDataList
							yearList = data.rtuHistoryNearlyYearDataList
							// console.log(data)
							this.curveList = []
							for (var i = 0; i < paraNameList.length; i++) {
								var title = paraNameList[i]
								var hisMonList = this.getHisList(monList, i)
								var hisYearList = this.getHisList(yearList, i)
								var unit = ""
								if (monList.length > 0) {
									unit = monList[0].parameterDataList[i].unit
								}
								// alert(unit)
								this.curveList.push({
									title: title,
									unit: unit,
									hisMonList: hisMonList.reverse(),
									hisYearList: hisYearList.reverse()
								})

							}
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin = false
					// alert(error)
				})
			},
			getMassifSoilDataMethod(massifId) { //获取地块土壤数据
				this.soilList = []
				this.showSpin1 = true
				getMassifSoilData(massifId).then(res => {
					const data = res.data
					this.showSpin1 = false
					if (data.success == 1) {
						// console.log(data)
						if (data.rtuData != '' && data.rtuData != null) {
							const rtuData = data.rtuData
							// console.log(rtuData)
							this.showSoilDataMethod(rtuData)
						}
						if (data.rtuHistoryNearlyMonthDataList != null && data.rtuHistoryNearlyYearDataList.length != null) {
							var paraNameList = data.paraNameList
							// this.curveList1 = data.paraNameList
							var monList = []
							var yearList = []
							monList = data.rtuHistoryNearlyMonthDataList
							yearList = data.rtuHistoryNearlyYearDataList
							// console.log(data)
							this.curveList1 = []
							for (var i = 0; i < paraNameList.length; i++) {
								var title = paraNameList[i]
								var hisMonList = this.getHisList(monList, i)
								var hisYearList = this.getHisList(yearList, i)
								var unit = ""
								if (monList.length > 0) {
									unit = monList[0].parameterDataList[i].unit
								}
								this.curveList1.push({
									title: title,
									unit: unit,
									hisMonList: hisMonList.reverse(),
									hisYearList: hisYearList.reverse()
								})
							}
						}
						// console.log(this.curveList1)
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin1 = false
					// alert(error)
				})
			},
			getHisList(list, i) {
				var hisList = []
				for (var j = 0; j < list.length; j++) {
					hisList.push({
						dataTime: list[j].dataTime,
						parameterValue: list[j].parameterDataList[i]
					})
				}
				return hisList
			},
			getIaVideoList() {
				this.showIaVideoList = true
				getIAVideoList(this.iaBigDataMapId).then(res => {
					// console.log(res)
					const data = res.data
					if (data.success == 1) {
						this.iaVideoImgList = data.externalVideoList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			handleFullscreen() {
				// let main = main.body
				// this.getEtWideHigh()
				let main = this.$refs.map
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

					// this.getEtWideHigh()

				} else {

					this.value = true
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
			getNearDayFarmDataMethod(wsRtuNumber, iaMassifId) {
				getNearlyDayImportParaDataList(wsRtuNumber, iaMassifId).then(res => {
					const data = res.data
					if (data.success == 1) {
						// alert(data)
						var wsRtuHisDataList = []
						if (data.wsRtuHistoryDataList.length > 30) {
							wsRtuHisDataList = data.wsRtuHistoryDataList.slice(0, 31)
						} else {
							wsRtuHisDataList = data.wsRtuHistoryDataList
						}
						// console.log(wsRtuHisDataList)
						this.tempData = wsRtuHisDataList.reverse()

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					// alert(error)
				})
			},


			showWeatherDataMethod(rtuWeatherData) {
				var list = rtuWeatherData.parameterDataList
				for (var i = 0; i < list.length; i++) {
					if (list[i].parameterId == 9) {
						list[i].iconColor = '#0187fc'
					} else if (list[i].parameterId == 10) {
						list[i].iconColor = '#16c8c4'
					} else if (list[i].parameterId == 11) {
						list[i].iconColor = '#fc9143'
					} else if (list[i].parameterId == 12) {
						list[i].iconColor = '#ffce6b'
					} else if (list[i].parameterId == 13) {
						list[i].iconColor = '#67c300'
					} else if (list[i].parameterId == 14) {
						list[i].iconColor = '#16c8c4'
					} else if (list[i].parameterId == 15) {
						list[i].iconColor = '#fc9143'
					} else if (list[i].parameterId == 16) {
						list[i].iconColor = '#ffce6b'
					} else if (list[i].parameterId == 17) {
						list[i].iconColor = '#0187fc'
					} else if (list[i].parameterId == 18) {
						list[i].iconColor = '#4ad595'
					} else {
						list[i].iconColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math
							.floor(Math.random() * 255) + ')'
					}
				}
				this.mlList = list
			},
			showSoilDataMethod(rtuSoilData) {
				var list = rtuSoilData.parameterDataList
				var list1 = []
				// alert(rtuSoilData)
				for (var i = 0; i < list.length; i++) {
					if (list[i].parameterId == 32) {
						list[i].iconColor = '#0187fc'
						list1.push(list[i])
					} else if (list[i].parameterId == 18) {
						list[i].iconColor = '#8f3ef7'
						list1.push(list[i])
					} else if (list[i].parameterId == 33) {
						list[i].iconColor = '#06cce4'
						list1.push(list[i])
					} else {
						list[i].iconColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math
							.floor(Math.random() * 255) + ')'
					}
				}
				this.soilList = list1

			},
		},
		mounted() {}
	}
</script>

<style lang="less">
	.count-style {
		font-size: 50px;
	}

	.map {
		// line-height: 0
		height: 100%;
		position: relative;
		overflow: hidden;
		width: 100%;
		color: #ffffff
	}

	.map .maxh {
		height: 58%
	}


	.map .minh {
		height: 30%
	}

	.map .bTop {
		top: 8%
	}


	.map .bBottom {
		bottom: 3%
	}

	.map .lDistance {
		left: 2%
	}

	.map .rDistance {
		right: 2%
	}

	.map .publicStyle {
		position: absolute;
		width: 28%;
		line-height: 0;
		overflow: hidden;

	}

	.map .demo-spin-icon-load {
		animation: ani-demo-spin 1s linear infinite;
	}

	@keyframes ani-demo-spin {
		from {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.publicStyle img {
		width: 100%;
		height: 100%
	}

	.curve {
		display: flex;
		justify-content: space-around;
		text-align: center;
		font-size: 0.625rem;
		padding-top: 0.3125rem;
		color: #31abe3
	}

	.curve button {
		color: #31abe3;
		background: #0d319a;
		border: 0;
		padding: 0 0.3125rem
	}

	.curve .btnColor1 {
		// background: #000000;
		background-image: linear-gradient(to right, #a541ff, #3fbbfe);
		color: #ffffff
	}

	.curve1 {
		float: left;
		width: 50%;
		height: 100%;
		// padding-right: 0.625rem
	}

	.curveEchart {
		width: 100%;
		height: 100%
	}

	.titleImg {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}

	.title img {
		pointer-events: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}

	.map .mapContent {
		position: absolute;
		top: 8%;
		width: 40%;
		left: 30%;
		bottom: 3%;
		// height: 100%
		// background: #00BFFF;
	}

	.mapContent .compent {
		position: absolute;
		z-index: 1;
		width: 45%;
		top: 2%;
		// right: 2%;
		// height: auto;
		overflow: hidden;
		height: 25%;
	}

	.compent .img1 {
		position: absolute;
		width: 100%;
		height: 100%
	}

	.compent .title {
		position: absolute;
		top: 0;
		padding: 0.625rem;
		color: '#00b8ff';
	}

	.map .title span {
		// color: '#00b8ff';
		padding-left: 0.3125rem;
		font-size: 0.75rem;
	}

	.map .titleText {
		text-align: center;
		color: #ffffff;
		position: absolute;
		top: 0;
		width: 100%;
		height: 7%;
		// left: 30%;
		// line-height: 100%
		display: flex;
		justify-content: center;
		align-items: center // align-content: center
	}

	.titleText h2 {
		font-size: 1.5625rem
	}

	@media screen and (max-width: 1600px) {
		// html {
		// 	font-size: 60px;
		// }
	}

	@media screen and (max-width: 1200px) {
		// html {
		// 	font-size: 60px;
		// }
	}

	@media screen and (max-width: 800px) {
		// html {
		// 	font-size: 16px;
		// }
	}

	@media screen and (max-width: 600px) {
		// html {
		// 	font-size: 12px;
		// }
	}
</style>
