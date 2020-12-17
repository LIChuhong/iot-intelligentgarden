<template>
	<div class="hello-ezuikit-js">
		<div id="video-container" style="width:100%;height:100%"></div>
	</div>
</template>

<script>
	import EZUIKit from "ezuikit-js"
	import {
		getVideoByDeviceSerialChannelNo
	} from '@/api/video.js'

	export default {
		name: "HelloWorld",
		props: ['videoKey', 'iaVideoList', 'getVideoInfo', 'etWideHigh'],
		data() {
			return {
				player: '',
			}
		},
		watch: {
			etWideHigh() {
				if (this.player == '') {

				} else {
					// console.log(this.etWideHigh)
					this.player.reSize(this.etWideHigh.w, this.etWideHigh.h)
				}
				// alert(1)
			},
			getVideoInfo(val) {
				// console.log(1)
				//  console.log(val)
				var videoBrandAccount = val.videoBrandAccount
				var videoDeviceInfo = val.videoDeviceInfo
				this.showPlayer1(videoBrandAccount.accessToken, videoDeviceInfo.highDefinitionUrl)
				// this.getNewVideoInfo(val.deviceSerial,val.channelNo)

			},
			videoKey(value) {
				// console.log(value)
				if (value.videoBrandAccount != null && value.videoBrandAccount != '') {
					var videoBrandAccount = value.videoBrandAccount
					var videoDeviceInfo = value.videoDeviceInfo
					if (this.player == '') {
						this.showPlayer(videoBrandAccount.accessToken, videoDeviceInfo.highDefinitionUrl)
					} else {
						this.showPlayer1(videoBrandAccount.accessToken, videoDeviceInfo.highDefinitionUrl)
					}
					// this.showPlayer1(value.accessToken, this.iaVideoList[0].highDefinitionUrl)
				}
			}
		},
		methods: {
			getNewVideoInfo(deviceSerial, channelNo) {
				getVideoByDeviceSerialChannelNo(deviceSerial, channelNo).then(res => {
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						var video = data.video
						var videoBrandAccount = video.videoBrandAccount
						var videoDeviceInfo = video.videoDeviceInfo
						this.showPlayer1(videoBrandAccount.accessToken, videoDeviceInfo.highDefinitionUrl)
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})

			},
			showPlayer1(accessToken, iaVideoUrl) {
				this.$nextTick(() => {
					this.player.play({
						accessToken: accessToken,
						url: iaVideoUrl,
					});
				})
			},
			showPlayer(accessToken, iaVideoUrl) {
				var that = this
				// alert(JSON.stringify(this.etWideHigh))
				this.$nextTick(() => {
					this.player = new EZUIKit.EZUIKitPlayer({
						autoplay: false,
						id: "video-container",
						accessToken: accessToken,
						url: iaVideoUrl,
						template: "standard",
						// splitBasis: 1,
						// header: ['capturePicture', 'save', 'zoom'],
						// footer: ['fullScreen','capturePicture', 'save', 'zoom'],
						width: that.etWideHigh.w,
						height: that.etWideHigh.h
					});
					// console.log(this.player)
				})

			}
		},
		mounted() {
			// this.showPlayer('', '')
			this.showPlayer(this.videoKey.videoBrandAccount.accessToken, this.videoKey.videoDeviceInfo.highDefinitionUrl)
		},
		destroyed() {
			this.player.stop()
		}
	};
</script>
