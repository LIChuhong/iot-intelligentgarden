<template>
	<div class="linkListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchLink" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="linkColumns" :data="linkData" :loading="tableLoading">
			<template slot-scope="{ row, index }" slot="linkageType">
				<span v-show="row.linkageType == 0">执行联动</span>
				<span v-show="row.linkageType == 1">反馈联动</span>
				<span v-show="row.linkageType == 2">监测联动</span>
				<span v-show="row.linkageType == 3">控制联动</span>

			</template>

			<template slot-scope="{ row, index }" slot="action">

				<Button v-if="$store.state.app.iotInterFace == 0" icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)">编辑</Button>
				<Button v-else icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)"></Button>

			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑联动" v-model="showLinkInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<link-form :link-id="linkId" v-if="showLinkInfo">编辑</link-form>
		</Modal>
	</div>
</template>


<script>
	import {
		linkColumns
	} from '@/data/columns.js'
	import {
		getRtuLinkageList
	} from '@/api/strategy.js'
	import LinkForm from '../component/link-form.vue'
	export default {
		name: 'link_list',
		components:{
			LinkForm
		},
		data() {
			return {
				linkId: null,
				showLinkInfo: false,
				linkColumns: linkColumns,
				linkData: [],
				tableLoading: false,
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],
			}
		},
		methods: {
			searchLink(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getLinkDataList()

			},
			nextPage() {
				if (this.linkData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getLinkDataList()
				}

			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getLinkDataList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},
			editor(row) {
				this.linkId = row.id
				this.showLinkInfo = true
			},

			getLinkDataList() {
				this.tableLoading = true
				getRtuLinkageList(this.searchKey, this.maxId, this.pageSize).then(res => {
					this.tableLoading = false
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						// this.linkData = data.rtuLinkageList
						this.linkData = data.rtuLinkageList.map(item => {
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
			this.getLinkDataList()
		}
	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		.linkListStyle{
			margin-top: 0.625rem;
		}
		.linkListStyle .ivu-modal-body {
			padding: 0;
		}
			
		.linkListStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
