<template>
	<div class="mapListStyle">
		<Table size="small" border :columns="mapListColumns" :data="mapListData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<Button icon="ios-eye" type="success" size="small" style="margin-right: 15px" @click="getMapInfo(row,'check')">查看</Button>
				<Button v-if="$store.state.app.iotInterFace == 0" icon="ios-create-outline" type="primary" size="small" style="margin-right: 15px"
				 @click="getMapInfo(row,'editor')">编辑</Button>
				<Poptip :transfer="true" confirm title="你确定删除该策略吗?" @on-ok="del(row,index)">
					<Button icon="ios-trash" type="error" size="small">删除</Button>
				</Poptip>
			</template>
		</Table>
	</div>

</template>

<script>
	import {
		getMapList,
		delMap
	} from '@/api/farm.js'
	import {
		mapListColumns
	} from '@/data/columns.js'
	export default {
		data() {
			return {
				tableLoading: false,
				mapListColumns: mapListColumns,
				orgId: this.$store.state.user.userInfo.orgId,
				mapListData: [],
			}
		},
		methods: {
			getMapInfo(row, val) {
				this.$emit('get-map-info', row, val)
			},
			del(row, index) {
				this.tableLoading = true
				delMap(row.id).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.mapListData.splice(index, 1);
						this.$emit('get-map-info', row, 'del')
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			getRtusMapList() {
				this.tableLoading = true
				getMapList(this.orgId).then(res => {
					this.tableLoading = false
					const data = res.data
					if (data.success == 1) {
						this.mapListData = data.mapList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
		},
		created() {
			this.getRtusMapList()
		}
	}
</script>

<style>
	.ivu-poptip-confirm .ivu-poptip-body .ivu-icon {
		display: none;
	}

	@media screen and (min-width:300px) and (max-width:900px) {
		.mapListStyle {
			margin-top: 0.625rem;
		}

		.mapListStyle .ivu-modal-body {
			padding: 0;
		}

		.mapListStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
