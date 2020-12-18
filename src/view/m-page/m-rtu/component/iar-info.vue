<template>
	<div class="iarStyle1">
		<!-- 气象站 -->
		<div style="height: 6.25rem;text-align: center;position: relative">
			<img :src="iaRtu.rtuTypeImgUrl" style="height:100%;" />
			<div style="position: absolute;right:1.875rem;bottom:0">
				<Icon @click="showVideo('live')" :type="' iconfont' + ' ' +  videoIcon" size="40" color="red"></Icon>
			</div>
			<div style="position: absolute;left:1.25rem;top:0">
				<Icon :type="iaRtu.signal" size="40" color="#5cadff" />
			</div>
		</div>
		<div class="iarStyle">
			<!-- <p>信号强度:</p> -->

			<div style="width: 50%;text-align: center;" v-for="(item,index) in parameterDataList" :key="index">
				<p><span>
						<Icon :color="item.iconColor" :type="' iconfont'+ ' ' +item.iconFont" /></span>{{item.parameterName}}:<span
					 :style="{color:item.iconColor }">{{item.value}}{{item.unit}}</span></p>

			</div>
		</div>
		<Spin fix v-show="showSpin" style="background: rgba(255,255,255,0.3);">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>检测中...</div>
		</Spin>
		<Modal v-model="showVideoInfo" title="视频详情" footer-hide fullscreen>
			<Icon slot="close" type="md-close" size="30" />
			<video-info :video-info="videoInfo" v-if="showVideoInfo"></video-info>
		</Modal>
	</div>
</template>

<script>
	import {
		getRtu,
		getRtuData
	} from '@/api/rtu.js'
	import {
		getSignal
	} from '@/libs/tools.js'
	import {
		getVideo
	} from '@/api/video.js'
	import VideoInfo from '../component/video-info.vue'

	export default {
		props: ['rtuNumber'],
		components: {
			VideoInfo
		},
		data() {
			return {
				iaRtu: {
					signal: ''
				},
				parameterDataList: [],
				showSpin: false,
				videoInfo: '',
				videoIcon: '',
				showVideoInfo: false
			}
		},
		methods: {
			showVideo(suffix) {
				if (this.videoInfo.brandTag == 'YSY') {
					this.videoInfo.suffix = suffix
					this.showVideoInfo = true
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
			getRuDataInfo() {
				if (this.rtuNumber != null && this.rtuNumber != '') {
					this.showSpin = true
					getRtuData(this.rtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							// console.log(data)
							const rtuData = data.rtuData
							if (rtuData.parameterDataList != null && rtuData.parameterDataList) {
								this.parameterDataList = rtuData.parameterDataList.map(item => {
									if (item.parameterId == 4 && item.parameterIndex == 0) {
										if (this.iaRtu.rtuCharacteristic == 0) {
											this.iaRtu.signal = getSignal(item.value)
										}
									}
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
										item.iconColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
											Math.floor(Math.random() * 255) + ')'
									}
									return item
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

		},
	}
</script>

<style>
	.iarStyle {
		display: flex;
		flex-wrap: wrap;
		margin: 1.25rem 0;
	}

	.iarStyle p {
		margin: 0.3125rem 0;
		font-size: 1rem;

	}

	.iarStyle1 .ivu-modal-body {
		padding: 0;
	}

	.iarStyle p span {
		color: #87ceeb;
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
