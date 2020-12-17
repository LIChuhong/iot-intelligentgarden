<template>
	<div ref="dom" class="charts chart-bar"></div>
</template>

<script>
	import echarts from 'echarts'
	// import tdTheme from './charts-json/theme.json'
	import {
		on,
		off,
		timestampToTimeMethod,
		timestampToTime
	} from '@/libs/tools'
	import {
		getNearlyDayImportParaDataList
	} from '@/api/plot.js'
	// echarts.registerTheme('tdTheme', tdTheme)
	export default {
		name: 'ChartTemper',
		props: {
			titleName: {
				type: String,
				default: ''
			},
			legendName: {
				type: String,
				default: '近一年降雨量'
			},
			tempData: {
				type: Array,
				default: funcution=>{
					return []
				}
			},
			tempColor: {
				type: Array,
				default: funcution=>{
					return ['#00a7fe', '#3ed795', '#ffce6b']
				}
			}
		},
		data() {
			return {
				dataList: [],
				dom: null
			}
		},
		watch: {
		
			tempData(val, old) {
				if (val != null && val != '') {
					// alert(val)
					this.getNearDayFarmDataMethod(val[0].wsRtuNumber, val[0].iaMassifId)
				}
			}
		},
		methods: {
			resize() {
				this.dom.resize()
			},
			getNearDayFarmDataMethod(wsRtuNumber, iaMassifId) {
				this.dataList = []
				this.setOptionMethod()
				this.dom.showLoading({
					 text: '',
					color: this.tempColor[0],
					textColor: this.tempColor[0],
					maskColor: 'rgba(255, 255, 255, 0.1)',
					zlevel: 0,
					// 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
					fontSize: 10,
					spinnerRadius: 7,
					// 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
					lineWidth: 1
				})
				getNearlyDayImportParaDataList(wsRtuNumber, iaMassifId).then(res => {
					const data = res.data
					this.dataList = []
					this.dom.hideLoading()
					if (data.success == 1) {
						// alert(data)
						var wsRtuHisDataList = []
						if (data.wsRtuHistoryDataList.length > 30) {
							wsRtuHisDataList = data.wsRtuHistoryDataList.slice(0, 31)
						} else {
							wsRtuHisDataList = data.wsRtuHistoryDataList
						}
						// console.log(wsRtuHisDataList)
						var val = wsRtuHisDataList.reverse()
						
						for (var i = 0; i < val.length; i++) {
							var list = val[i].parameterDataList
							var time = timestampToTimeMethod(val[i].dataTime, 'hours')
							this.dataList.push({
								time: time,
								'空气温度(℃)': list[0].value,
								'空气湿度(%)': list[1].value,
								'土壤湿度(%)': list[9].value,
								// list:list
							})
							// console.log(val[i])
							
						}
						this.setOptionMethod()

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.dom.hideLoading()
					alert(error)
				})
			},
			setOptionMethod() {
				const option = {
					title: {
						text: this.titleName,
						textStyle: {
							//fontSize: 16
						}
					},
					dataset: {
						// 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
						// 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
						// dimensions: ['time', '湿度', '温度'],
						source: this.dataList
					},
					grid: {
						left: '3%',
						// right: '4%',
						top: '35%',
						width: '94%',
						bottom: '10%',
						// height: '70%',
						containLabel: true
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
							fontSize: 10,
							lineHeight: 0,
						},

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
					yAxis: [{
							type: 'value',
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
									color: '#fff',
									fontSize: 10,
									lineHeight: 0

								}
							}
						},
						{
							type: 'value',
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
									color: '#fff',
									fontSize: 10,
									lineHeight: 0

								}
							}
						},
					],
					series: [{
							type: 'line',
							yAxisIndex: 0,
							itemStyle: {
								color: this.tempColor[0]
							},
							lineStyle: {
								color: this.tempColor[0]
							},
						},
						{
							type: 'line',
							yAxisIndex: 1,
							itemStyle: {
								color: this.tempColor[1]
							},
							lineStyle: {
								color: this.tempColor[1]
							},

						},
						{
							type: 'line',
							yAxisIndex: 1,
							itemStyle: {
								color: this.tempColor[2]
							},
							lineStyle: {
								color: this.tempColor[2]
							},

						},
					]
				};
				this.$nextTick(() => {
					this.dom = echarts.init(this.$refs.dom)
					this.dom.setOption(option)
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
