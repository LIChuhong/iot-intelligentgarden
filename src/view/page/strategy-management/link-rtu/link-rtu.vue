<template>
	<div class="linkRtuStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchLink" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="linkRtuColumns" :data="linkRtuData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<div v-if="$store.state.app.iotInterFace == 0">

				<Button icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)">{{$t('editor')}}</Button>
				<Poptip placement="right" :transfer="true" confirm title="你确定删除该绑定联动设备吗?" @on-ok="del(row,index)">
					<Button icon="md-trash" type="error" size="small" style="margin-right: 8px">{{$t('delete')}}</Button>
				</Poptip>
				</div>
				<div v-else>
				
				<Button icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)"></Button>
				<Poptip placement="right" :transfer="true" confirm title="你确定删除该绑定联动设备吗?" @on-ok="del(row,index)">
					<Button icon="md-trash" type="error" size="small" style="margin-right: 8px"></Button>
				</Poptip>
				</div>

			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">{{$t('next_page')}}</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">{{$t('previous_page')}}</Button>
		</div>
		<Modal title="编辑绑定联动" v-model="showLinkRtuInfo" footer-hide width="700">
			<Icon slot="close" type="md-close"  size="30"/>
			<binding-link :number="rtuNumber" v-if="showLinkRtuInfo"></binding-link>
		</Modal>
	</div>
</template>


<script>
	import {
		linkRtuColumns
	} from '@/data/columns.js'
	import {
		getLinkageRtuList,unbindingRtuLinkage
	} from '@/api/strategy.js'
	import BindingLink from '../binding-link/binding-link.vue'
	export default {
		name: 'link_list',
		components: {
			BindingLink
		},
		data() {
			return {
				rtuNumber:null,
				showLinkRtuInfo: false,
				linkRtuColumns: linkRtuColumns,
				linkRtuData: [],
				tableLoading: false,
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],
			}
		},
		methods: {
			del(row, index) {
				unbindingRtuLinkage(row.rtuNumber).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.linkRtuData.splice(index, 1);
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			searchLink(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getLinkRtuDataList()

			},
			nextPage() {
				if (this.linkRtuData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getLinkRtuDataList()
				}

			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getLinkRtuDataList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},
			editor(row) {
				 this.rtuNumber = row.rtuNumber
				this.showLinkRtuInfo = true
			},

			getLinkRtuDataList() {
				this.tableLoading = true
				getLinkageRtuList(this.searchKey, this.maxId, this.pageSize).then(res => {
					this.tableLoading = false
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						// this.linkData = data.rtuLinkageList
						this.linkRtuData = data.rtuList.map(item => {
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							// item.createTime = timestampToTime(item.createTime)
							return item
						})

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			}
		},

		mounted() {
			this.getLinkRtuDataList()
		}
	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		.linkRtuStyle{
			margin-top: 0.625rem;
		}
		.linkRtuStyle .ivu-modal-body {
			padding: 0;
		}
			
		.linkRtuStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
