<template>
	<div ref="divTableHeight" class="mRtuStyle">
		<div style="overflow: hidden;padding: 0.5rem;position: fixed;z-index: 2;width: 100%;background: #dcdee2;">
			<Button style="float: right;" type="text" @click="refreshRtuList"><a>刷新</a></Button>

			<Input search enter-button placeholder="请输入关键字" @on-search="findRtuList" style="width: 15.625rem;" />

		</div>
		<!-- <div style="position: absolute;top:3.125rem;bottom: 6.25rem;width: 100%;"> -->
		<!-- <div style="overflow: hidden;padding: 8px;position:absolute;width: 100%;height: 100%;"> -->
		<Table :max-height="tableHeight" style="margin: 3rem 0 0;" size="small" border :columns="rtuListColumns" :data="rtuListData"
		 :loading="tableLoading" @on-row-click="show_rtu_info">
			<template slot-scope="{ row }" slot="rtuTypeImgUrl">
				<div style="height:2.8125rem ;display: flex;justify-content: center; align-items: center">
					<img :src="row.rtuTypeImgUrl" :alt="row.rtuNumber" style="max-height: 2.8125rem;max-width:2.8125rem;" />
				</div>
			</template>
			<!-- <template slot-scope="{ row }" slot="nameAndserialNum">
				<p>{{ row.rtuNumber }}</p>
				<p>({{ row.rtuName }})</p>
			</template> -->
			<template slot-scope="{ row }" slot="rtuState">
				<div style="position: relative;height: 2.875rem;line-height:2.875rem;">
					<div style="position: absolute;right:0;top:-0.625rem;">
						<Badge v-show="row.working" status="processing" />
					</div>
					<Badge v-show="row.networkState == 1" status="success" text="在线" />
					<Badge v-show="row.networkState == 0" status="default" text="离线" />
				</div>
			</template>
			<!-- <template slot-scope="{ row, index }" slot="action">
				<Button size="small" type="text" @click="show_rtu_info(row,index)" style="font-size: 12px;"><a>详情</a></Button>
			</template> -->
			<!-- <template v-if="addList" slot="footer"> -->

			<div v-show="addList" slot="footer" style="text-align: center;font-size: 1rem;margin:0 0;"><a @click="getRtuList">加载更多...</a></div>
			<!-- </template> -->

		</Table>
		<!-- </div> -->
		<!-- <div style="text-align: center;font-size: 1rem;padding: 0.625rem 0;"><a >加载更多...</a></div> -->
		<!-- <div style="overflow: hidden;padding:0.625rem 0.625rem;position: fixed;bottom:3.125rem;width: 100%;background: #dcdee2;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div> -->
		<!-- </div> -->

		<Modal v-model="showRtuInfo" :title="rtuModalTitle" footer-hide fullscreen @on-cancel="cancel">
			<!-- <rtu-form :rtu-number="rtuNumber" v-if="showRtuInfo">修改</rtu-form> -->
			<!-- <template slot="close"> -->
			<Icon slot="close" type="md-close" size="30" />
			<!-- </template> -->
			<iar-info v-if="rtuTypeTag == 'IA_WS'" :rtu-number="rtuNumber"></iar-info>
			<iasf-info v-if="rtuTypeTag == 'IA_SF'" :rtu-number="rtuNumber"></iasf-info>
			<iaw-info v-if="rtuTypeTag == 'IA_W'" :rtu-number="rtuNumber"></iaw-info>
			<iat-info v-if="rtuTypeTag == 'IA_T'" :rtu-number="rtuNumber"></iat-info>
			<default-rtu-info v-if="rtuTypeTag == 'default_rtu'" :rtu-number="rtuNumber"></default-rtu-info>
		</Modal>

	</div>
</template>

<script>
	import {
		getRtuList,
		isEnableRtu
	} from '@/api/rtu'
	import {
		rtuListColumns1
	} from '@/data/columns.js'
	import IarInfo from './component/iar-info.vue'
	import IasfInfo from './component/iasf-info.vue'
	import IawInfo from './component/iaw-info.vue'
	import IatInfo from './component/iat-info.vue'
	import DefaultRtuInfo from './component/default-rtu-info.vue'
	// import RtuForm from '../component/rtu-form.vue'
	// import CopyRtu from '../component/copy-rtu.vue'
	import RtuTag from '@/data/rtu-tag.js'
	export default {
		name: 'm_rtu',
		components: {
			IarInfo,
			IasfInfo,
			IawInfo,
			IatInfo,
			DefaultRtuInfo

		},
		data() {
			return {
				addList: true,
				tableHeight: 500,
				rtuTypeTag: '',
				rtuModalTitle: '设备详情',
				tableLoading: false,
				copyRtuTitle: '',
				showCopyform: false,
				showRtuInfo: false,
				rtuNumber: null,
				rtuListColumns: rtuListColumns1,
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
			refreshRtuList() {
				this.maxId = 0
				this.rtuListData = []
				this.searchKey = ''
				this.getRtuList()

			},
			detectionRtu(row, index) {

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

			show_rtu_info(row, index) {
				// console.log(row)
				if (row.rtuTypeTag == RtuTag.rtuWSTag1 || row.rtuTypeTag == RtuTag.rtuWSTag2) {
					this.rtuTypeTag = 'IA_WS'
				} else if (row.rtuTypeTag == RtuTag.rtuSFTag1 || row.rtuTypeTag == RtuTag.rtuSFTag2) {
					this.rtuTypeTag = 'IA_SF'
				} else if (row.rtuTypeTag == RtuTag.rtuWTag1 || row.rtuTypeTag == RtuTag.rtuWTag2) {
					this.rtuTypeTag = 'IA_W'
				} else if (row.rtuTypeTag == RtuTag.rtuTTag1 || row.rtuTypeTag == RtuTag.rtuTTag2) {
					this.rtuTypeTag = 'IA_T'
				} else {
					this.rtuTypeTag = 'default_rtu'
				}
				this.rtuModalTitle = row.rtuNumber + '-' + row.rtuTypeName
				this.rtuNumber = row.rtuNumber
				this.showRtuInfo = true
			},
			getRtuList() {
				this.tableHeight = this.$refs.divTableHeight.clientHeight - 50
				this.tableLoading = true
				getRtuList(this.keyField, this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					// console.log(data)
					this.tableLoading = false
					if (data.success == 1) {
						// console.log(22)
						if (data.iaRtuList) {
							data.iaRtuList.map(item => {
								item.checkLoading = false
								item.switchLoading = false
								if (this.maxId < item.id) {
									this.maxId = item.id
								}
								this.rtuListData.push(item)
								return item
							})
							if (data.iaRtuList.length < this.pageSize) {
								this.addList = false
							} else {
								this.addList = true
							}
						}
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
				this.rtuListData = []
				this.prevId = [0]
				this.getRtuList()
			},
			cancel() {
				this.rtuTypeTag = ''
			}
		},
		mounted() {
			// this.$route.meta.keepAlive = true

			this.getRtuList()
		},
	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		.mRtuStyle {
			overflow: hidden;
			position: relative;
			height: 100%;
		}

		.mRtuStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
