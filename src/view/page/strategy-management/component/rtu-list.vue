<template>
	<div>
		<Table size="small" border :columns="columns" :data="rtuData" :loading="selLoading">
			<template slot-scope="{ row, index }" slot="action">
				<Button :disabled="row.checkBtn" size="small" @click="checkRtu(row)">选择</Button>
			</template>
		</Table>

		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<div>
			<span v-for="(item,index) in rtuNumberList" :key="item" style="background: #c5c8ce;padding: 0.3125rem;border-radius:5%;margin-left: 0.3125rem;">{{item.rtuNumber}}
				<Icon @click="delRtu(item,index)" type="md-close" style="margin-left: 0.3125rem;cursor:pointer;" /></span>

		</div>
		<div style="overflow: hidden;">
			<Button type="primary" style="float: right;" @click="checkRtuOk">确定</Button>
		</div>
	</div>

</template>

<script>
	import {
		getRtuList
	} from '@/api/rtu'
	export default {
		props:['list'],
		data() {
			return {
				rtuNumberList: [],
				columns: [{
						title: '设备编号',
						key: 'rtuNumber',
						align: 'center',

					},
					{
						title: '设备名称',
						key: 'rtuName',
						align: 'center',
					},
					{
						title: '设备类型',
						key: 'rtuTypeName',
						align: 'center',
					},
					{
						title: '操作',
						slot: 'action',
						align: 'center',
						width: 80
					},
				],
				rtuData: [],
				keyField: 0,
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				selLoading: false,
				prevId: [0],
				index: 0,

			}
		},
		methods: {
			checkRtuOk(){
				this.$emit('check-rtu-ok',this.rtuNumberList)
				this.rtuNumberList = []
			},
			delRtu(item, index) {
				// for(var i in rtuData)
				this.rtuNumberList.splice(index, 1)

			},
			checkRtu(row) {
				let rtuNumberList = this.rtuNumberList
				var index = 0
				for (var i in rtuNumberList) {
					if (rtuNumberList[i].id == row.id) {
						index++
					}
				}
				if (index == 0) {
					this.rtuNumberList.push(row)
				}

			},
			nextPage() {
				if (this.rtuData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getRtuList()
				}

			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getRtuList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},
			getRtuList() {
				this.selLoading = true
				getRtuList(this.keyField, this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					// console.log(data)
					this.selLoading = false
					if (data.success == 1) {
						this.rtuData = data.iaRtuList.map(item => {
							item.checkBtn = false
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							// this.rtuListData.push(item)
							return item
						})
						//this.rtuList = data.rtuList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.selLoading = false
					//this.mRtuListLoading = false
					alert(error)
				})
			},


		},
		created() {
			this.getRtuList()
			this.rtuNumberList = this.list
		}

	}
</script>

<style>
</style>
