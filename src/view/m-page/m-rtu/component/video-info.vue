<!-- 用户组件 -->
<template>
	<div ref="ezuikt11" style="height: 100%;width: 100%;position: relative;">
		<!-- <EZUIKitJs :et-wide-high="etWideHigh"></EZUIKitJs> -->
		<div v-show="videoInfo.videoType == 1 && modelTest == 0" style="font-size: 1rem;padding: 0.3125rem 0.3125rem;position: absolute;bottom:1rem;right:1rem;z-index: 2;">
			<div style="text-align: right;margin-bottom: 0.625rem;">
				<!-- <ButtonGroup size="large">
					<Button icon="md-expand" @click="controlYsOpen(8)"></Button>
					<Button icon="md-contract" @click="controlYsOpen(9)"></Button>
					<Button icon="md-resize" @click="controlYsOpen(11)"></Button>
					<Button icon="ios-locate" @click="controlYsOpen(10)"></Button>
				</ButtonGroup> -->
				<Icon class="controlYs" color="#F5871F" style="margin-right: 1rem;" type="ios-add-circle-outline" size="35"  @click="controlYsOpen(8)"/>
				<Icon color="#F5871F" type="ios-remove-circle-outline" size="35" @click="controlYsOpen(9)"/>
			</div>
			<div v-show="presetPoint != -1" style="text-align: right;">预置点:
				<Icon @click="addPreset" v-show="presetPoint == 1" type="md-add-circle" size="25" />
				<Icon @click="delPreset" v-show="presetPoint == 0" type="md-remove-circle" size="25" />
				<Button @click="usePreset" :disabled="presetPoint == 1" type="primary" style="margin-left: 0.625rem;">调用</Button>
			</div>
			

		</div>

		<div style="font-size: 1rem;padding: 0.3125rem 0.3125rem;position: absolute;bottom:1rem;left:1rem;z-index: 2;">
			<!-- <Button size="large" icon=" iconfont icon-hf1" @click="videoModel">{{modelTest}}</Button> -->
			<Icon @click="videoModel(modelTest)" :type="modelTest==0?' iconfont icon-hf1':' iconfont icon-yl'" size="35" color="#2d8cf0"/>
			<!-- <Icon type="ios-arrow-dropright" @click="videoModel(modelTest)" size="35" color="#2d8cf0"/> -->
		</div>



		<iframe :src="videoUrl" id="ysOpenDevice" height="100%" width="100%" frameborder="0" border="0" >
		</iframe>
		<!-- {{videoInfo}} -->


		<!-- 	<div id="video-container" style="width:100%;height:100%">
		</div>

		<div v-show="videoInfo.videoType == 1">
			<div style="text-align: right;font-size: 1rem;padding: 0.3125rem 0.3125rem;">
				<span>预置点:
					<Icon type="md-add-circle" size="25" /><span style="width: 2.5rem;">6</span>
					<Icon type="md-remove-circle" size="25" /></span>
				<Button type="primary" size="small" style="margin-left: 0.625rem;">调用</Button>
			</div>
			<div id="btnBgDiv" style="width: 210px;height: 210px;border-radius: 50%;background: #BFC7D3;position: relative;margin:0 auto;">
				<div style="position: absolute;width: 70px;height: 70px;top:0;left:70px;">
					<Icon size="50" type="md-arrow-dropup" style="margin:0px 10px 20px 10px;" />
				</div>

				<div style="position: absolute;width: 70px;height: 70px;bottom:0;left:70px;">
					<Icon size="50" type="md-arrow-dropdown" style="margin:20px 10px 0px 10px;" />
				</div>

				<div style="position: absolute;width: 70px;height: 70px;top:70px;right:0;">
					<Icon size="50" type="md-arrow-dropright" style="margin:10px 0px 10px 20px;" />
				</div>
				<div style="position: absolute;width: 70px;height: 70px;top:70px;left:0;">
					<Icon size="50" type="md-arrow-dropleft" style="margin:10px 20px 10px 0px;" />
				</div>

				<div style="position: absolute;width: 70px;height: 70px;border-radius: 50%;background: #F5871F;left:70px;top:70px;z-index: 200;touch-action: none;"
				 id="btnDiv" @touchstart="touchstartView">
				</div>
			</div>

		</div> -->
	</div>

</template>

<script>
	import EZUIKit from "ezuikit-js"
	import $ from 'jquery'
	import {
		addRtuVideoPresetPoint,
		delRtuVideoPresetPoint,
		moveRtuVideoPresetPoint
	} from '@/api/video.js'
	export default {
		props: {
			videoInfo: {
				type: Object,
				default: funcution => {
					return {}
				},
			},
		},
		data() {
			return {
				modelTest: 0,
				presetPoint: 1,
				flags: false,
				videoUrl: ''
			}
		},
		directives: {
			drag(el, bindings) {
				el.touchstart = function(e) {
					let disx = e.clientX - el.offsetLeft;
					let disy = e.clientY - el.offsetTop;
					// console.log('disx:'+disx)

					document.ontouchmove = function(e) {
						var lLeft = parseFloat(el.style.left)
						var tTop = parseFloat(el.style.top)
						if (lLeft < 140 && lLeft > 0 && tTop < 140 && tTop > 0) {
							let l = e.clientX - disx;
							let t = e.clientY - disy;
							//移动当前元素
							el.style.left = l + "px";
							el.style.top = t + "px";


						}

					}
					document.ontouchend = function() {

						document.ontouchmove = document.ontouchend = null;
					}
				}
			},

		},

		methods: {
			videoModel() {
				var videoBrandAccount = this.videoInfo.videoBrandAccount
				var videoDeviceInfo = this.videoInfo.videoDeviceInfo
				var accessToken = videoBrandAccount.accessToken
				var deviceSerial = videoDeviceInfo.deviceSerial
				var channelNo = videoDeviceInfo.channelNo
				var validCode = videoDeviceInfo.validCode
				if (this.modelTest == 0) {
					this.videoUrl = 'https://open.ys7.com/ezopen/h5/rec?autoplay=0&accessToken=' + accessToken + '&deviceSerial=' + deviceSerial + '&channelNo=' + channelNo 
					this.modelTest = 1
				}else{
					this.videoUrl = 'https://open.ys7.com/ezopen/h5/live?autoplay=0&audio=1&accessToken=' + accessToken + '&deviceSerial=' + deviceSerial + '&channelNo=' + channelNo
					this.modelTest = 0
				}
				if (validCode) {
					this.videoUrl += '&validCode=' + validCode
				}


			},
			usePreset() {
				if (this.videoInfo) {
					var rtuNumber = this.videoInfo.rtuNumber
					moveRtuVideoPresetPoint(rtuNumber).then(res => {
						const data = res.data
						if (data.success == 1) {
							// this.$Message.success('预置点设置成功')
							// this.videoInfo.presetPoint = '1'
						} else {
							this.$Message.success(data.errorMessage)
						}
					}).catch(error => {
						alert(error)
					})
				}
			},
			addPreset() {
				if (this.videoInfo) {
					var rtuNumber = this.videoInfo.rtuNumber
					addRtuVideoPresetPoint(rtuNumber).then(res => {
						const data = res.data
						if (data.success == 1) {
							this.$Message.success('预置点设置成功')
							this.presetPoint = 0
						} else {
							this.$Message.success('预置点设置失败')
						}
					}).catch(error => {
						alert(error)
					})
				}

			},
			delPreset() {
				// alert(1)
				if (this.videoInfo) {
					var rtuNumber = this.videoInfo.rtuNumber
					delRtuVideoPresetPoint(rtuNumber).then(res => {
						const data = res.data
						if (data.success == 1) {
							this.$Message.success('预置点删除成功')
							this.presetPoint = 1
						} else {
							this.$Message.success('预置点删除失败')
						}
					}).catch(error => {
						alert(error)
					})
				}
			},
			showPlayer(accessToken, iaVideoUrl) {
				var that = this
				// alert(JSON.stringify(this.etWideHigh))
				var width = this.$refs.ezuikt11.offsetWidth
				this.$nextTick(() => {
					that.player = new EZUIKit.EZUIKitPlayer({
						autoplay: false,
						id: "video-container",
						accessToken: accessToken,
						url: iaVideoUrl,
						template: "security",
						splitBasis: 1,
						// header: ['capturePicture', 'save', 'zoom'],
						// footer: ['fullScreen','capturePicture', 'save', 'zoom'],
						width: width,
						height: 300
					});
					console.log('1:' + that.player)
				})

			},
			controlYsOpen(direction) {
				var that = this
				var accessToken = this.videoInfo.videoBrandAccount.accessToken
				var deviceSerial = this.videoInfo.videoDeviceInfo.deviceSerial
				var channelNo = this.videoInfo.videoDeviceInfo.channelNo
				$.ajax({
					url: "https://open.ys7.com/api/lapp/device/ptz/start",
					type: "post",
					data: {
						accessToken: accessToken,
						deviceSerial: deviceSerial,
						channelNo: channelNo,
						direction: direction,
						speed: 1
					},
					success: function(res) {
						if (res.code === "10029") {
							that.$Message.warning(res.msg)
						} else {
							that.controlYsDown(direction)
						}
						// alert(res)
					},
					error: function(error) {
						console.log(error)
						// that.$Message.warning(error)
						// alert('failed!');
					},
				});
			},
			controlYsDown(direction) {
				var accessToken = this.videoInfo.videoBrandAccount.accessToken
				var deviceSerial = this.videoInfo.videoDeviceInfo.deviceSerial
				var channelNo = this.videoInfo.videoDeviceInfo.channelNo
				$.ajax({
					url: "https://open.ys7.com/api/lapp/device/ptz/stop",
					type: "post",
					data: {
						accessToken: accessToken,
						deviceSerial: deviceSerial,
						channelNo: channelNo,
						direction: direction,
						speed: 1
					},
					success: function(res) {
						if (res.code === "10029") {
							that.$Message.warning(res.msg)
						}
						// alert(res.geocodes[0].formatted_address + "经纬度：" + res.geocodes[0].location);
						console.log(res); //在console中查看数据
					},
					error: function(error) {
						console.log(error)
						// alert('failed!');
					},
				});
			},
			setBorderColor(borderDirection, color, colorDir) {
				document.getElementById('btnBgDiv').style.border = ''
				document.getElementById('btnBgDiv').style[borderDirection] = color
				document.getElementById('btnBgDiv').style.boxShadow = colorDir + ' ' + color + ' ' + 'inset'
			},
			touchstartView(event) {
				// console.log(event)
				var index = -1
				var that = this
				that.flags = true;
				var touch;
				if (event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				let disx = touch.clientX - document.getElementById('btnDiv').offsetLeft;
				let disy = touch.clientY - document.getElementById('btnDiv').offsetTop;
				document.ontouchmove = function(event) {
					if (that.flags) {
						var touch;
						if (event.touches) {
							touch = event.touches[0];
						} else {
							touch = event;
						}

						var lLeft = parseFloat(document.getElementById('btnDiv').style.left)
						var tTop = parseFloat(document.getElementById('btnDiv').style.top)
						if (lLeft < 140 && lLeft > 0 && tTop < 140 && tTop > 0) {
							let l = touch.clientX - disx;
							let t = touch.clientY - disy;
							//移动当前元素
							document.getElementById('btnDiv').style.left = l + "px";
							document.getElementById('btnDiv').style.top = t + "px";
							if (l >= 140) {
								document.getElementById('btnDiv').style.left = '139px'
							}
							if (l <= 0) {
								document.getElementById('btnDiv').style.left = '1px'
							}
							if (t >= 140) {
								document.getElementById('btnDiv').style.top = '139px'
							}
							if (t <= 0) {
								document.getElementById('btnDiv').style.top = '1px'
							}


							var t1 = parseFloat(document.getElementById('btnDiv').style.top)
							var l1 = parseFloat(document.getElementById('btnDiv').style.left)
							console.log('t:' + t1)
							console.log('l:' + l1)
							// console.log(document.getElementById('btnDiv').style)
							if (t1 == 1 && l1 >= 50 && l1 <= 90) {
								console.log('正上0')
								that.setBorderColor('borderTop', '#F5871F', '0px 10px 10px 1px')
								if (index != 0) {
									that.controlYsDown(index)
									that.controlYsOpen(0)
									index = 0
								}

								// that.controlYsDown(2)
							}
							if (t1 == 139 && l1 >= 50 && l1 <= 90) {
								console.log('正下1')
								that.setBorderColor('borderBottom', '#F5871F', '0px -10px 10px 1px')
								if (index != 1) {
									that.controlYsDown(index)
									that.controlYsOpen(1)
									index = 1
								}

								// that.controlYsDown(2)
							}
							if (l1 == 1 && t1 >= 50 && t1 <= 90) {
								console.log('正左2')
								that.setBorderColor('borderLeft', '#F5871F', '10px 0px 10px 1px')
								if (index != 2) {
									that.controlYsDown(index)
									that.controlYsOpen(2)
									index = 2
								}

								// that.controlYsDown(2)
							}
							if (l1 == 139 && t1 >= 50 && t1 <= 90) {
								console.log('正右3')
								that.setBorderColor('borderRight', '#F5871F', '-10px 0px 10px 1px')
								if (index != 3) {
									that.controlYsDown(index)
									that.controlYsOpen(3)
									index = 3
								}

								// document.getElementById('btnBgDiv').style.borderRight = '0.0625rem solid #F5871F'
								// document.getElementById('btnBgDiv').style.boxShadow = '-10px 0px 10px 1px #F5871F inset'

								// that.controlYsDown(2)
							}
							if (t1 == 1 && l1 == 1) {
								console.log('左上4')
								if (index != 4) {
									that.controlYsDown(index)
									that.controlYsOpen(4)
									index = 4
								}

							}
							if (t1 == 139 && l1 == 1) {
								console.log('左下5')
								if (index != 5) {
									that.controlYsDown(index)
									that.controlYsOpen(5)
									index = 5
								}

							}
							if (t1 == 1 && l1 == 139) {
								console.log('右上6')
								if (index != 6) {
									that.controlYsDown(index)
									that.controlYsOpen(6)
									index = 6
								}

							}
							if (t1 == 139 && l1 == 139) {
								console.log('右下7')
								if (index != 7) {
									that.controlYsDown(index)
									that.controlYsOpen(7)
									index = 7
								}

							}

						}

						//阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
						document.addEventListener("touchmove", function() {
							event.preventDefault();
						}, false);
					}

				};
				document.ontouchend = function() {
					that.controlYsDown(index)
					// that.controlYsOpen()
					document.getElementById('btnBgDiv').style.border = ""
					document.getElementById('btnBgDiv').style.boxShadow = ""
					document.getElementById('btnDiv').style.left = 70 + "px";
					document.getElementById('btnDiv').style.top = 70 + "px";
					that.flags = false;

				}

			},

		},
		mounted() {
			if (this.videoInfo != '') {
				// console.log(this.video)

				var videoBrandAccount = this.videoInfo.videoBrandAccount
				var videoDeviceInfo = this.videoInfo.videoDeviceInfo
				var accessToken = videoBrandAccount.accessToken
				var deviceSerial = videoDeviceInfo.deviceSerial
				var channelNo = videoDeviceInfo.channelNo
				var validCode = videoDeviceInfo.validCode
				var suffix = this.videoInfo.suffix
				this.presetPoint = this.videoInfo.presetPoint
				this.videoUrl = 'https://open.ys7.com/ezopen/h5/live?autoplay=0&accessToken=' + accessToken +
					'&deviceSerial=' + deviceSerial + '&channelNo=' + channelNo
				if (validCode) {
					this.videoUrl += '&validCode=' + validCode
				}
				// console.log(this.videoUrl)

				// this.showPlayer(videoBrandAccount.accessToken, videoDeviceInfo.fluentUrl)
				// console.log(this.player)

			}
		},
	}
</script>

<style>
	.controlYs:active{
		color: #000000;
	}
</style>
