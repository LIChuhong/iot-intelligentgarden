<template>
	<div style="height: 100%;">
		<div v-show="showData">
			<div style="display: flex;flex-wrap: wrap;justify-content:space-between;padding:0 0.625rem;">
				<div v-for="(item,i) in sf.waterTankList" :key="i">
					<p>
						<Checkbox :disabled="sf.working" v-model="item.value">{{item.label}}</Checkbox>
					</p>
					<p>注水容量:{{item.waterFloodingCapacity}}(L)</p>
					<p>肥料容量:<Input :disabled="sf.working" type="number" style="width: 4.375rem;" v-model="item.fertilizerCapacity"
						 size="small" />(kg)</p>
					<p>肥水比例:{{item.waterFertilizerRatio}}(kg/L)</p>
				</div>

			</div>
			<div style="display: flex;flex-wrap: wrap;justify-content:space-between;padding: 0.625rem 0.625rem 0;">
				<div>恒定流量:<Input :disabled="sf.working" type="number" size="small" style="width:4.375rem;" v-model="sf.constantFlow" />(m³/h)</div>
				<div>停止容量:<Input :disabled="sf.working" type="number" size="small" style="width:4.375rem;" v-model="sf.stopCapacity" />(L)</div>

			</div>
			<div style="display: flex;flex-wrap: wrap;justify-content:space-between;padding:0 0.625rem 0;">
				<div>浇灌策略:
					<Select :disabled="sf.working" size="small" v-model="sf.switchsStrategyId" style="width:6.25rem">
						<Option v-for="item in wateStrategyList" :value="item.id" :key="item.id">{{ item.strategyName }}</Option>
					</Select>
				</div>
				<div style="width: 12.5rem;">搅拌时间:{{sf.stirTime}}分钟
					<Slider :disabled="sf.working" style="margin-right: 1.25rem;" v-model="sf.stirTime" :step="1" :max="maxStirTime"></Slider>
				</div>
			</div>
			<div style="display: flex;flex-wrap: wrap;justify-content:space-between;padding: 0 0.625rem 0;">

				<div>注水时间:{{sf.waterFloodingRunTime}}</div>

				<div>灌溉时间:{{sf.waterRunTime}}</div>
				<div>施肥时间:{{sf.applyFertilizerRunTime}}</div>
			</div>
			<div style="display: flex;flex-wrap: wrap;justify-content:space-around">
				<div>
					<Button :disabled="sf.working" type="primary" @click="startRtu(7)">一键启动</Button>
				</div>
				<div>
					<Poptip confirm title="确定要停止该水肥一体机吗?" @on-ok="startRtu(8)" @on-cancel="cancel">
						<Button :disabled="!sf.working" type="primary">一键停止</Button>
					</Poptip>
				</div>
				<div>
					<Button :disabled="!sf.working" type="primary" @click="startRtu(9)">{{sf.pause?'继续':'暂停'}}</Button>
				</div>
			</div>

		</div>
		<Spin fix v-show="showSpin" style="background: rgba(255,255,255,0.3);">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<!-- <div>加载中...</div> -->
		</Spin>
	</div>
</template>

<script>
	import {
		getIASFRtuData,
		setControlIASFRtu
	} from '@/api/rtu.js'
	import {
		getExeModeSwitchsStrategyList
	} from '@/api/strategy.js'
	import {
		formatSeconds1
	} from '@/libs/tools.js'
	export default {
		props: ['sfRtuNumber'],
		data() {
			return {
				showData: false,
				timer: null, //定时器名称
				showSpin: false,
				wateStrategyList: [],
				maxStirTime: 10, //最长搅拌时间
				sf: {
					working: false,
					constantFlow: 5, //恒定流量
					stopCapacity: 100, //停止容量
					stirTime: 0, //搅拌时间
					waterFloodingRunTime: '', //注水时间
					waterRunTime: '', //灌溉时间
					applyFertilizerRunTime: '', //施肥时间
					switchsStrategyId: 7, //所选策略ID
					waterTankList: [{
							value: false,
							label: "使用A水箱",
							waterFloodingCapacity: '', //注水容量
							fertilizerCapacity: '', //肥料容量
							waterFertilizerRatio: ''

						},
						{
							value: false,
							label: "使用B水箱",
							waterFloodingCapacity: '',
							fertilizerCapacity: '',
							waterFertilizerRatio: ''

						},
						{
							value: false,
							label: "使用C水箱",
							waterFloodingCapacity: '',
							fertilizerCapacity: '',
							waterFertilizerRatio: ''

						}

					],
				},
			}
		},
		methods: {
			cancel() {},
			setTime() {
				this.timer = setInterval(() => {
					setTimeout(this.getIaSfRtuData, 0)
				}, 5000)
			},

			startRtu(orderType) {
				// clearInterval(this.timer)
				clearInterval(this.timer);
				this.timer = null;
				var list = this.sf.waterTankList
				// console.log(list)
				var list1 = list.map(item => {
					if (item.fertilizerCapacity != '' && item.fertilizerCapacity > 0 && item.value) {
						item.fertilizerCapacity = parseFloat(item.fertilizerCapacity)
					} else {
						item.fertilizerCapacity = 0
					}
					return item
				})

				// console.log(list1)
				var iasfRtuOrderData = {
					'rtuNumber': parseInt(this.sfRtuNumber),
					'orderType': parseInt(orderType),
					'waterApplyFertilizer': {
						'fertilizerCapacityA': list1[0].fertilizerCapacity,
						"fertilizerCapacityB": list1[1].fertilizerCapacity,
						"fertilizerCapacityC": list1[2].fertilizerCapacity,
						'constantFlow': parseInt(this.sf.constantFlow),
						'stopCapacity': parseInt(this.sf.stopCapacity),
						'stirTime': parseInt(this.sf.stirTime * 60),
						'switchsStrategyId': parseInt(this.sf.switchsStrategyId)
					}

				}
				this.showSpin = true
				setControlIASFRtu(iasfRtuOrderData).then(res => {
					const data = res.data
					this.showSpin = false
					if (data.success == 1) {
						this.getIaSfRtuData()
						this.$Message.success(data.errorMessage)

					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					this.showSpin = false
					alert(error)

				})
			},
			getIaSfRtuData() {
				if (this.sfRtuNumber != null && this.sfRtuNumber != '') {
					this.showSpin = true
					clearInterval(this.timer);
					this.timer = null;
					getIASFRtuData(this.sfRtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							this.showData = true
							// const waterApplyFertilizer = data.waterApplyFertilizer
							this.showWaterApplyFertilizer(data.waterApplyFertilizer)


						} else {
							// this.showData = true
							this.showData = false
							this.$Message.error(data.errorMessage ? data.errorMessage : '设备不在线')
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})

				}

			},
			showWaterApplyFertilizer(waterApplyFertilizer) {
				var data = waterApplyFertilizer
				this.sf.working = data.working
				if (data.working && !data.pause) {
					this.setTime()
				}
				this.sf.pause = data.pause
				this.sf.constantFlow = data.constantFlow
				this.sf.stopCapacity = data.stopCapacity
				if (data.waterFloodingRunTime != null && data.waterFloodingRunTime >= 0) {
					this.sf.waterFloodingRunTime = formatSeconds1(data.waterFloodingRunTime)
				} else {
					this.sf.waterFloodingRunTime = ""
				}
				if (data.waterRunTime != null && data.waterRunTime >= 0) {
					this.sf.waterRunTime = formatSeconds1(data.waterRunTime)
				} else {
					this.sf.waterRunTime = ""
				}
				if (data.applyFertilizerRunTime != null && data.applyFertilizerRunTime >= 0) {
					this.sf.applyFertilizerRunTime = formatSeconds1(data.applyFertilizerRunTime)
				} else {
					this.sf.applyFertilizerRunTime = ""
				}
				if (data.switchsStrategyId != null && data.switchsStrategyId != '') {
					this.sf.switchsStrategyId = data.switchsStrategyId
					var list = this.wateStrategyList
					for (var i = 0; i < list.length; i++) {
						if (this.sf.switchsStrategyId == list[i].id) {
							this.maxStirTime = this.getStirTimeNum(list[i])
							break;
						}
					}
					
					this.sf.stirTime = data.stirTime / 60

				} else {
					this.maxStirTime = this.getStirTimeNum(this.wateStrategyList[0])
				}

				if (data.fertilizerCapacityA > 0) {
					this.getWaterTankListValue(0, true, data.fertilizerCapacityA, data.waterFloodingCapacityA, data.waterFertilizerRatioA)
				} else {
					this.getWaterTankListValue(0, false, '', '', '')
				}
				if (data.fertilizerCapacityB > 0) {
					this.getWaterTankListValue(1, true, data.fertilizerCapacityB, data.waterFloodingCapacityB, data.waterFertilizerRatioB)
				} else {
					this.getWaterTankListValue(1, false, '', '', '')
				}
				if (data.fertilizerCapacityC > 0) {
					this.getWaterTankListValue(2, true, data.fertilizerCapacityC, data.waterFloodingCapacityC, data.waterFertilizerRatioC)
				} else {
					this.getWaterTankListValue(2, false, '', '', '')
				}

			},
			getWaterTankListValue(index, value, fertilizer, waterFlooding, waterFertilizer) {
				this.sf.waterTankList[index].value = value
				this.sf.waterTankList[index].fertilizerCapacity = fertilizer
				if (waterFlooding != '') {
					this.sf.waterTankList[index].waterFloodingCapacity = parseFloat(waterFlooding).toFixed(2)
				} else {
					this.sf.waterTankList[index].waterFloodingCapacity = waterFlooding
				}

				this.sf.waterTankList[index].waterFertilizerRatio = waterFertilizer
			},
			getStirTimeNum(switchsStrategy) {
				// alert(switchsStrategy)
				if (switchsStrategy != null && switchsStrategy != '' && switchsStrategy != []) {
					const list1 = switchsStrategy.switchsGroupStrategyList
					
					// alert(list1)
					if(list1[0] != null && list1[0] != ''){
						var rtuNumber = list1[0].rtuNumberList[0]
						var list2 = list1.slice(1);
						var stirTimeNum = list1[0].delayTime + list1[0].workTime
						for (var i = 0; i < list2.length; i++) {
							var rtuNumberList = list2[0].rtuNumberList
							var sameRtuNum = 0
							for (var j = 0; j < rtuNumberList.length; j++) {
								if (rtuNumber == rtuNumberList[j]) {
									sameRtuNum++
								}
							}
							if (sameRtuNum == 0) {
								stirTimeNum += (list2[i].delayTime + list2[i].workTime)
							} else {
								break;
							}
						}
						return stirTimeNum / 60
					}else{
						return 10
					}
					// var rtuNumber = list1[0].rtuNumberList[0]
					
				} else {
					return 10
				}




			},
			getStrategyList() {
				// alert(this.sfRtuNumber)
				this.showSpin = true
				getExeModeSwitchsStrategyList(0,'',0,100).then(res => {
					const data = res.data
					this.showSpin = false
					if (data.success == 1) {
						this.wateStrategyList = data.switchsStrategyList
						// this.wateStrategy = data.switchsStrategyList[0].id
						// this.maxStirTime = this.getStirTimeNum(data.switchsStrategyList[0])
						this.getIaSfRtuData()

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.showSpin = false
					alert(error)
				})
			}
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.timer = null;
		},

		created() {
			this.getStrategyList()
		},
		mounted() {
			// this.getStrategyList()
			// this.setTime()
		}
	}
</script>

<style>
</style>
