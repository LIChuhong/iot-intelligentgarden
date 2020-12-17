<template>
	<div ref="dom"></div>
</template>

<script>
	import echarts from 'echarts'
	import {
		on,
		off,
		timestampToTimeMethod
	} from '@/libs/tools'
	export default {
		props: {
			titleName: {
				type: String,
				default: '近一年降雨量'
			},
			legendName: {
				type: String,
				default: '近一年降雨量'
			},
			barData: {
				type: Array,
				default: funcution=>{
					return []
				}
			},
			barColor: {
				type: String,
				default: '#83bff6'
			},
			lineLoading:{
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				dataList: [],
				dom: null,
				screenWidth: null
			}
		},
		watch: {
			lineLoading(val, old){
				// console.log('lineLoading'+val)
				if(val){
					this.dataList = []
					this.setOptionMethod()
					this.dom.showLoading({
						 text: '',
						 color: this.barColor,
						 textColor: this.barColor,
						maskColor: 'rgba(255, 255, 255, 0)',
						zlevel: 0,
						fontSize: 10,
						
					})
				}else{
					this.dom.hideLoading()
				}
			},
			barData(val, old) {
				if (val != null && val != '') {
					// alert(JSON.stringify(val))
					this.dataList = []
					for (var i = 0; i < val.length; i++) {
						var value = val[i].parameterValue.value
						var time = ''
						// alert(val[i].dataTime)
						if (this.titleName == '近一年月平均曲线' || this.titleName == '近一年月平均值') {
							time = timestampToTimeMethod(val[i].dataTime, 'year')
							// alert(time)

						} else if (this.titleName == '近一月日平均曲线') {
							time = timestampToTimeMethod(val[i].dataTime, 'month')
						}
						this.dataList.push({
							time: time,
							value: value
						})


					}
					// alert(this.dataList)
					this.setOptionMethod()

				}
			}
		},
		methods: {
			resize() {
				this.dom.resize()
			},
			setOptionMethod() {
				const option = {
					title: {
						text: this.titleName,
						top: 0,
						right: 0,
						// bottom:'20%',
						textStyle: {
							fontSize: 10,
							// lineHeight: 0,
							color: this.barColor
							// width:'100%'
						},
					},
					tooltip: {
						confine: true,
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								// backgroundColor: '#6a7985',
								lineHeight: 0,
								fontSize: 10

							},
						},
						textStyle: {
							fontSize: 12,
							lineHeight: 0,
						}
					},
					legend: {
						bottom: '20%',
						padding: 0,
						icon: 'roundRect',
						itemHeight: 6,
						itemWidth: 15,
						textStyle: {
							color: '#fff',
							fontSize: 8,
							lineHeight: 0
						}

					},
					dataset: {
						// dimensions: ['id','value'],
						source: this.dataList
					},
					xAxis: {
						type: 'category',
						axisLabel: {
							// inside: true,
							show: true,
							textStyle: {
								color: '#fff',
								fontSize: 10,
								lineHeight: 0
							},

						},
						splitLine: {
							show: false
						},

						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},

					},
					yAxis: {
						splitLine: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							textStyle: {
								color: '#999',

							}
						}
					},
					grid: {
						left: '3%',
						// right: '4%',
						bottom: '35%',
						width: '94%',
						height: '55%',
						containLabel: true
					},
					series: [{
						name: this.legendName,
						type: 'bar',
						encode: {},
						itemStyle: {
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1,
								[{
										offset: 0,
										color: '#eee'
									},
									// {
									// 	offset: 0.5,
									// 	color: this.barColor
									// },
									{
										offset: 1,
										color: this.barColor
									}
								]
							)
						},
						emphasis: {
							itemStyle: {
								color: this.barColor

							}
						},
					}]
				}
				// console.log(option)
				this.$nextTick(() => {
					this.dom = echarts.init(this.$refs.dom)
					this.dom.setOption(option)
					// window.onresize = this.dom.resize
					on(window, 'resize', this.resize)

				})

			}


		},

		mounted() {
			this.setOptionMethod()
		},
		beforeDestroy() {
			off(window, 'resize', this.resize)
		}
	}
</script>

<style>
</style>
