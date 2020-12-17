<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		name: 'App',
		data() {
			return {
				//msg: "哈哈"
			}
		},
		methods: {
			...mapMutations([
				'setIotInterFace'
			]),
			_isMobile() {
				let screenWidth = screen.width
				let screenHeight = screen.height
				let flag = screenWidth < screenHeight
				return flag;
			},

		},

		created() {
			// alert(1)
			
			if (this._isMobile()) {
				
				// alert(paramerValue)
				var url=window.location.href.split("?")[1];
				// alert(1)
				var paramerValue = ''
				if(url){
					if(url.indexOf('interFrom')>-1){
						paramerValue=url.split("=")[1]
					}
				}
				
				 if(paramerValue != '3'){
					// alert(1)
					if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
						//Ios
						// this.$config.iotInterFace = 2
						this.setIotInterFace(3)
					} else if (/(Android)/i.test(navigator.userAgent)) {
						//Android终端
						// this.$config.iotInterFace = 1
						this.setIotInterFace(1)
					}
				}else{
					// alert(2)
					this.setIotInterFace(3)
				}
				

			} else {
				// this.$config.iotInterFace = 0
				this.setIotInterFace(0)

			}
			
			// console.log(this.$config.iotInterFace)
		},
	}
</script>

<style lang="less">
	.anchorBL{display:none;}
	.size {
		width: 100%;
		height: 100%;
	}

	html,
	body {
		.size;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	#app {
		.size;
	}
</style>
