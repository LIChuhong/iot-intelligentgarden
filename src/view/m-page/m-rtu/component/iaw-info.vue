<template>
	<div class="iawStyle">
		<!-- 浇灌器 -->
		<div style="height: 6.25rem;text-align: center;position: relative">
			<img :src="iaRtu.rtuTypeImgUrl" style="height:100%;" />
			<div style="position: absolute;right:1.875rem;bottom:0">
				<Icon @click="showVideo('live')" :type="' iconfont' + ' ' +  videoIcon" size="40" color="red"></Icon>
				<!-- <span v-show="videoIcon != ''" @click="showVideo('rec')">回看</span> -->
			</div>
		</div>
		<div style="display: flex;margin: 1.25rem 0;font-size: 1rem;">
			<p style="width: 50%;text-align: center;">状态:
				<Icon :color="iat.iconColor" :type="iat.icon" />
			</p>
			<p>剩余时间:<span :style="{color:iat.iconColor}">{{iat.restTime}}秒</span></p>
		</div>
		<div class="btnStyle" style="text-align: right;padding:0 1.25rem;overflow: hidden;">
			<Button  style="float: left;margin-top: 0.5625rem;" type="primary" @click="waterRecordMethod">浇水记录</Button>
			<Cascader v-model="refCas" style="display: inline-block;" :transfer="true" :data="iat.timeList" @on-change="setRtu" @on-visible-change="refreshCas">
				<Button size="large" :disabled="iat.restTime > 0" style="margin-right:1.25rem ;" type="primary" shape="circle">开</Button>
			</Cascader>
			<Button size="large" @click="setRtu1(0,false,true)" type="primary" shape="circle">关</Button>
		</div>
		<div style="margin: 1.25rem 0;">
			<div style="font-size: 1rem;text-align: center;" v-for="(item,index) in parameterDataList" :key="index">
				<p><span>
						<Icon :color="item.iconColor" :type="' iconfont'+ ' ' +item.iconFont" /></span>{{item.parameterName}}:<span :style="{color:item.iconColor }">{{item.value}}{{item.unit}}</span></p>
			</div>
		</div>
		<Spin fix v-show="showSpin" style="background: rgba(255,255,255,0.3);">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>{{tips}}</div>
		</Spin>
		<Modal v-model="showVideoInfo" title="视频详情" footer-hide fullscreen>
			<Icon slot="close" type="md-close"  size="30"/>
			<video-info :video-info="videoInfo" v-if="showVideoInfo"></video-info>
		</Modal>
		<Modal v-model="showWaterRecord" :title="rtuNumber+'-浇水记录'" footer-hide fullscreen>
			<Icon slot="close" type="md-close"  size="30"/>
			<!-- <video-info :video-info="videoInfo" v-if="showVideoInfo"></video-info> -->
			<water-record v-show="showWaterRecord" :rtu-number="rtuNumber"></water-record>
		</Modal>
	</div>
</template>

<script>
	import {
		getRtu,
		getRtuData,
		setRtuData
	} from '@/api/rtu.js'
	import {
		getSignal
	} from '@/libs/tools.js'
	import {
		rtuTimeDataList
	} from '@/view/components/js/data.js'
	import {
		getVideo
	} from '@/api/video.js'
	import VideoInfo from '../component/video-info.vue'
	import WaterRecord from '../component/water-record.vue'
	export default {
		props: ['rtuNumber'],
		components: {
			VideoInfo,
			WaterRecord
		},
		data() {
			return {
				showWaterRecord:false,
				refCas: [],
				tips: '检测中...',
				iaRtu: {},
				parameterDataList: [],
				showSpin: false,
				iat: {
					show: false,
					iconColor: '',
					icon: '',
					restTime: 0,
					timeList: [],
				},
				timer: '',
				videoInfo: '',
				videoIcon: '',
				showVideoInfo: false
			}
		},
		methods: {
			waterRecordMethod(){
				this.showWaterRecord = true
			},
			showVideo(suffix) {
				if (this.videoInfo.brandTag == 'YSY') {
					this.videoInfo.suffix = suffix
					this.showVideoInfo = true
				}
				// window.location.href = 'https://open.ys7.com/ezopen/h5/live?autoplay=1&accessToken=at.cgxifm1o2tog4z652rovgoqz2a2drac2-1la8xsi5y0-12rzmmy-5rzr1g7fa&deviceSerial=E38539884&channelNo=1'

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
			getRtuInfo() {
				if (this.rtuNumber != null && this.rtuNumber != '') {
					getRtu(this.rtuNumber).then(res => {
						const data = res.data
						if (data.success == 1) {
							// console.log(data)
							this.iaRtu = data.iaRtu
							var iaRtu = data.iaRtu
							if (iaRtu.videoId > 0) {
								var video = iaRtu.video
								if (video) {
									this.videoInfo = video
									if (video.videoType == 1) {
										this.videoIcon = 'icon-qj1'
									}
									if (video.videoType == 0) {
										this.videoIcon = 'icon-qj0'
									}
									if (iaRtu.presetPoint != null) {
										this.videoInfo.presetPoint = 0
									} else {
										this.videoInfo.presetPoint = 1
									}
									this.videoInfo.rtuNumber = this.rtuNumber
								}
							}

							// if (data.iaRtu.videoId > 0) {
							// 	this.getVideoInfo(data.iaRtu.videoId,data.iaRtu.presetPoint)
							// }
							this.getRuDataInfo()
						} else {
							this.$Message.error(this.rtuNumber + data.errorMessage)
						}
					}).catch(error => {
						alert(error)
					})
				}

			},
			setRtu(value) {
				if (value != 0) {
					value = Number(value[0])
				}
				this.setRtu1(value, false, false)
			},
			setRtu1(value, forceOpen, jumpLinkage) {
				var rtuData = {
					rtuNumber: this.rtuNumber,
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
				this.showSpin = true
				this.tips = '操作中...'
				setRtuData(rtuData).then(res => {
					const data = res.data
					this.showSpin = false
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
						if(data.linkageResult){
							var linkageResult = data.linkageResult
							this.parameterDataList = linkageResult.parameterDataList.map(item=>{
								if(!item.warned){
									item.iconColor = 'red'
								}else{
									item.iconColor = 'green'
								}
								return item
							})
						}
					} else {
						// console.log(data.linkageResult)
						if (data.linkageResult) {
							var linkageResult = data.linkageResult
							this.parameterDataList = linkageResult.parameterDataList.map(item=>{
								if(!item.warned){
									item.iconColor = 'red'
								}else{
									item.iconColor = 'green'
								}
								return item
							})
						
							if (!linkageResult.pass) {
								this.$Modal.confirm({
									title: linkageResult.tips,
									// content: '<p>'+data.linkageResult.tips+'</p>',
									okText: '强制执行',
									cancelText: '取消',
									onOk: () => {
										console.log(value)
										this.setRtu1(value,true,false)
									}
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
			getVideoInfo(id, presetPoint) {
				getVideo(id).then(res => {
					const data = res.data
					if (data.success == 1) {
						this.videoInfo = data.video
						var video = data.video
						if (video.videoType == 0) {
							this.videoIcon = 'icon-qj0'
						}
						if (video.videoType == 1) {
							this.videoIcon = 'icon-qj1'
						}
						if (presetPoint != null) {
							this.videoInfo.presetPoint = 0
						} else {
							this.videoInfo.presetPoint = 1
						}

						this.videoInfo.rtuNumber = this.rtuNumber
					}

				}).catch(error => {
					alert(error)
				})
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
			getRuDataInfo() {
				if (this.rtuNumber != null && this.rtuNumber != '') {
					this.showSpin = true
					getRtuData(this.rtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							// console.log(data)
							// this.iaRtu = data.iaRtu
							const rtuData = data.rtuData
							if (rtuData.parameterDataList != null && rtuData.parameterDataList) {

								rtuData.parameterDataList.map(item => {
									if (item.parameterId == 25) {
										this.setStateValue(item.value)
										this.iat.show = true
										this.iat.restTime = item.value
										clearInterval(this.timer);
										this.timer = setInterval(this.showRemTime, 1000);
									}
								})

							}

						} else {
							this.$Message.error(this.rtuNumber + data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}

			}

		},

		created() {
			this.getRtuInfo()
			this.iat.timeList = rtuTimeDataList
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>

<style>
	
	@media screen and (min-width:300px) and (max-width:900px) {
		.iawStyle .ivu-modal-body {
			padding: 0px;
		}

		.btnStyle {
			text-align: right;
			padding-right: 1.25rem;
		}

		.btnStyle .ivu-btn-large {
			height: 3.125rem;
			font-size: 1.5rem;
		}

		.test1 {
			padding: 0;
		}
	}

	.demo-spin-icon-load {
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
</style>
