<template>
	<div class="plotListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchDataMap" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="dataMapColumns" :data="dataMapData" :loading="tableLoading">
			<template slot-scope="{ row, index }" slot="cropImgUrl">
				<img :src="row.cropImgUrl" style="height: 3.125rem;width: 3.125rem;" />
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" @click="getDataMapInfo(row)">编辑</Button>
			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑数据画面" v-model="showDataMapInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<data-form :data-map-id="dataMapId" v-if="showDataMapInfo">编辑</data-form>
		</Modal>
		
	</div>
</template>


<script>
	import {
		dataMapColumns
	} from '@/data/columns.js'
	import {
		getIABigDataMapList
	} from '@/api/plot.js'
	import DataForm from '../component/data-form.vue'
	export default {
		components:{
			DataForm
		},
		data() {
			return {
				dataMapId:null,
				showDataMapInfo:false,
				dataMapColumns: dataMapColumns,
				dataMapData: [{}],
				tableLoading: false,
				maxId: 0,
				pageSize: 10,
				prevId: [0],
				mapName: ''
			}
		},
		methods: {
			
			getDataMapInfo(row){
				this.dataMapId = row.id
				this.showDataMapInfo = true
				// console.log(row)
				// this.$emit('get-data-map-info',row)
			},
			nextPage() {
				if (this.dataMapData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getDataMapList()
				}

			},

			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getDataMapList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},
			getDataMapList() {
				this.tableLoading = true
				getIABigDataMapList(this.mapName, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.dataMapData = data.iaBigDataMapList.map(item => {
							// item.checkLoading = false
							// item.switchLoading = false
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							return item
						})
						// this.strategyData = data.switchsStrategyList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			searchDataMap(searchKey) {
				this.mapName = searchKey
				this.maxId = 0
				this.prevId = [0]
				this.getDataMapList()
			}
		},
		created() {
			this.getDataMapList()
		}

	}
</script>

<style>
</style>
