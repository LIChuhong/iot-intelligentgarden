<template>
	<div>
		<div style="overflow: hidden;padding-bottom: 8px;">
			<Select v-model="keyField" style="width:100px;float: left;margin-right: 8px;">
				<Option v-for="item in keyFieList" :key="item.id" :value="item.id">{{item.title}}</Option>
			</Select>
			<Input search enter-button placeholder="请输入关键字" @on-search="findRtuList" style="width: 300px;float: left;" />
		</div>
		<Table size="small" border :columns="rtuListColumns" :data="rtuListData" :loading="tableLoading">
			<template slot-scope="{ row }" slot="rtuTypeImgUrl">
				<div style="height:2.8125rem ;display: flex;justify-content: center; align-items: center">
				<img :src="row.rtuTypeImgUrl" :alt="row.rtuNumber" style="max-height: 2.8125rem;max-width: 2.8125rem;" />
				</div>
			</template>
			<template slot-scope="{ row }" slot="nameAndserialNum">
				<p>{{ row.rtuNumber }}({{row.rtuName}})</p>
				<!-- <p>{{ row.rtuName }}</p> -->
				<p>{{ row.rtuSerialNumber }}</p>
			</template>
			<template slot-scope="{ row, index }" slot="action">

				<Button icon="ios-create-outline" size="small" style="margin-right: 10px" @click="show_rtu_info(row,index)">编辑</Button>
				<Button icon="ios-search-outline" type="warning" size="small" :loading="row.checkLoading" style="margin-right: 10px" @click="detectionRtu(row,index)">
					<span v-if="!row.checkLoading">检测在线</span>
					<span v-else>检测中....</span>
				</Button>
				<i-switch :loading="row.switchLoading" v-model="row.isEnable" @on-change="isEnableRtuMethods(row)" />
				<Button size="small" type="info" @click="copyRtu(row)">复制机器</Button>
			</template>
		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal v-model="showRtuInfo" title="编辑设备信息" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<rtu-form :rtu-number="rtuNumber" v-if="showRtuInfo">修改</rtu-form>
		</Modal>
		<Modal :title="copyRtuTitle" v-model="showCopyform" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<copy-rtu v-if="showCopyform" :rtuNumber="rtuNumber"></copy-rtu>

		</Modal>
	</div>
</template>

<script>
	import {
		getRtuList,
		isEnableRtu,getRtuData
	} from '@/api/rtu'
	import {
		rtuListColumns
	} from '@/data/columns.js'
	import RtuForm from '../component/rtu-form.vue'
	import CopyRtu from '../component/copy-rtu.vue'
	export default {
		name: 'rtu_list',
		components: {
			RtuForm,
			CopyRtu
		},
		data() {
			return {
				tableLoading: false,
				copyRtuTitle: '',
				showCopyform: false,
				showRtuInfo: false,
				rtuNumber: null,
				rtuListColumns: rtuListColumns,
				rtuListData: [],
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],
				keyField: 0,
				keyFieList: [{
						id: 0,
						title: '机器名称'
					},
					{
						id: 1,
						title: '机器编号'
					}
				],
			}
		},
		methods: {
			detectionRtu(row,index){
				row.checkLoading = true
				getRtuData(row.rtuNumber).then(res => {
					const data = res.data
					row.checkLoading = false
					if (data.success == 1) {
						const rtuData = data.rtuData
						this.$Message.success(row.rtuNumber+'设备在线')
				
					} else {
						this.$Message.error(row.rtuNumber + data.errorMessage)
					}
				}).catch(error => {
					row.checkLoading = false
					alert(error)
				})
			},
			isEnableRtuMethods(item) {
				item.switchLoading = true
				isEnableRtu(item.rtuNumber, item.isEnable).then(res => {
					const data = res.data
					item.switchLoading = false
					if (data.success == 1) {
						if (item.isEnable) {
							this.$Message.success(item.rtuNumber + '机器启用成功')
						} else {
							this.$Message.success(item.rtuNumber + '机器禁用成功')
						}
					} else {
						this.$Message.error(item.rtuNumber + data.errorMessage)
					}
				}).catch(error => {
					item.switchLoading = false
					alert(error)
				})
			},
			copyRtu(item) {
				this.copyRtuTitle = '复制' + item.rtuNumber + '机器'
				this.rtuNumber = item.rtuNumber
				// this.showEditorRtu = false
				this.showCopyform = true
			},
			show_rtu_info(row, index) {
				this.rtuNumber = row.rtuNumber
				this.showRtuInfo = true
			},
			getRtuList() {
				this.tableLoading = true

				getRtuList(this.keyField, this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					// console.log(data)
					this.tableLoading = false
					if (data.success == 1) {
						//console.log(data)
						this.rtuListData = data.iaRtuList.map(item => {
							item.checkLoading = false
							item.switchLoading = false
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							return item
						})
						//this.rtuList = data.rtuList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					//this.mRtuListLoading = false
					alert(error)
				})
			},

			nextPage() {
				if (this.rtuListData.length < this.pageSize) {
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
			findRtuList(searchKey) {
				//查找机器列表
				this.searchKey = searchKey
				this.maxId = 0
				this.prevId = [0]
				this.getRtuList()
			},
		},
		created() {
			// this.$route.meta.keepAlive = true
			this.getRtuList()
		},
	}
</script>

<style>
</style>
