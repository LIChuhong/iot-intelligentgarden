<template>
	<div>
		<!-- 水肥一体机 -->
		<div style="height: 6.25rem;text-align: center;position: relative">
			<img :src="iaRtu.rtuTypeImgUrl" style="height:100%;" />
			<div style="position: absolute;right:1.875rem;bottom:0">
				<Icon @click="showVideo('live')" :type="' iconfont' + ' ' +  videoIcon" size="40" color="red"></Icon>
			</div>
			<div style="position: absolute;left:1.25rem;top:0">
				<Icon :type="iaRtu.signal" size="40" color="#5cadff" />
			</div>
		</div>
		<sf-model :sf-rtu-number="rtuNumber"></sf-model>
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
	import SfModel from '@/view/page/farm-management/component/sf-model.vue'
	import {
		getVideo
	} from '@/api/video.js'
	import VideoInfo from '../component/video-info.vue'
	import {
		getSignal
	} from '@/libs/tools.js'
	import {
		getRtu,
		getRtuData
	} from '@/api/rtu.js'
	export default {
		props: ['rtuNumber'],
		components: {
			SfModel,
			VideoInfo
		},
		data() {
			return {
				iaRtu: {
					signal: ''
				},
				parameterDataList: [],
				parameterDataList1: [],
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
							// this.getRuDataInfo()
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
							// this.iaRtu = data.iaRtu
							const rtuData = data.rtuData
							var list = []
							var list1 = []
							if (rtuData.parameterDataList != null && rtuData.parameterDataList) {
								rtuData.parameterDataList.map(item => {
									if (item.parameterId == 4 && item.parameterIndex == 0) {
										if (this.iaRtu.rtuCharacteristic == 0) {
											this.iaRtu.signal = getSignal(item.value)
										}
									}
									if (item.parameterId == 20 || item.parameterId == 22 || item.parameterId == 28 || item.parameterId == 35) {
										item.icon = ' iconfont icon-ic_kqwd'
										if (item.value == 1) {
											item.title = '开'
											item.iconColor = '#00bfff'
										} else {
											item.title = '关'
											item.iconColor = 'red'
										}
										list.push(item)
									} else if (item.parameterId == 25 || item.parameterId == 27 || item.parameterId == 37 || item.parameterId ==
										35) {
										item.icon = ' iconfont icon-ic_kqwd'
										if (item.value == 1) {
											item.title = '开'
											item.iconColor = '#00bfff'
										} else {
											item.title = '关'
											item.iconColor = 'red'
										}
										list1.push(item)
									} else {
										item.icon = " "
										if (item.value == 1) {
											item.title = '开'
											item.iconColor = '#00bfff'
										} else {
											item.title = '关'
											item.iconColor = 'red'
										}
									}

								})

							}
							this.parameterDataList = list
							this.parameterDataList1 = list1
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
	.iasfStyle {
		display: flex;
		flex-wrap: wrap
	}

	.iasfStyle p {
		margin: 0.3125rem 0;
		/* font-size: 1rem; */
	}

	.iasfStyle p span {
		color: #00bfff;
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
