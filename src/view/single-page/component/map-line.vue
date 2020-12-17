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
				default: '近一月降雨量'
			},
			legendName: {
				type: String,
				default: '近一月降雨量'
			},
			lineData: {
				type: Array,
				default: funcution => {
					return []
				}
			},
			lineColor: {
				type: String,
				default: '#83bff6'
			},
			lineLoading: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			lineLoading(val, old) {
				// console.log('lineLoading'+val)
				if (val) {
					this.dataList = []
					this.setOptionMethod()
					this.dom.showLoading({
						text: '',
						color: this.lineColor,
						textColor: this.lineColor,
						maskColor: 'rgba(255, 255, 255, 0)',
						zlevel: 0,
						fontSize: 10,

					})
				} else {
					this.dom.hideLoading()
				}
			},
			lineData(val, old) {
				// alert(JSON.stringify(old))

				if (val != null && val != []) {
					// alert(JSON.stringify(val))
					this.dataList = []
					for (var i = 0; i < val.length; i++) {
						var value = val[i].parameterValue.value
						var time = ''
						// alert(val[i].dataTime)
						if (this.titleName == '近一年月平均曲线') {
							time = timestampToTimeMethod(val[i].dataTime, 'year')
							// alert(time)

						} else if (this.titleName == '近一月日平均曲线') {
							time = timestampToTimeMethod(val[i].dataTime, 'month')
							// console.log(time)

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
		data() {
			return {
				dataList: [],
				dom: null,
				screenWidth: null
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
							color: this.lineColor
							// width:'100%'
						}

					},
					tooltip: {
						confine: true,
						trigger: 'axis',
						// position: [10, 10],
						axisPointer: {
							type: 'cross',
							label: {
								// backgroundColor: '#6a7985',
								lineHeight: 0,
								fontSize: 10

							},
						},
						textStyle: {
							fontSize: 10,
							lineHeight: 0,
							// width: '100%'
						}
					},
					legend: {
						// data: ['近一月降雨量'],
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
					grid: {
						left: '3%',
						// right: '4%',
						// top:'35%',
						bottom: '35%',
						width: '90%',
						height: '55%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						// data: dataAxis,
						axisLabel: {
							// inside: true,
							textStyle: {
								color: '#fff',
								fontSize: 10,
								lineHeight: 0
							},
							interval:6
						},
						splitLine: {
							show: false
						},
						// axisLabel:{
						// 	interval:5
						// }
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							textStyle: {
								color: '#999',
								fontSize: 10,
								lineHeight: 0

							}
						},
						splitLine: {
							show: false
						},
					}],
					series: [{
							name: this.legendName,
							type: 'line',
							// stack: '总量',
							itemStyle: {
								color: this.lineColor
							},
							lineStyle: {
								color: this.lineColor
							},
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: this.lineColor
									},
									{
										offset: 1,
										color: '#eee'
									}
								])
							},
							// data: data
						},

					]
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
