<template>
	<List style="background: #eeeeee;padding: 0 0.625rem;">
		<ListItem v-for="(item,index) in messageList" :key="index">
			<ListItemMeta>
				<template slot="title">
					<div>
						<p>ID:{{item.id}} &nbsp;&nbsp;<span>设备编号:{{item.rtuNumber}}</span></p>
						<p style="text-indent: 2em;">
							<span style="color: #2db7f5;">{{item.type == 0?'参数报警':'设备报警'}}</span>
							&nbsp;&nbsp;
							<span>级别:<span :style="{color:item.warnLevel==0?'yellow':item.warnLevel==1?'orange':'red'}">{{item.warnLevel==0?'低':item.warnLevel==1?'中':'高'}}</span></span>&nbsp;&nbsp;
							<span>报警次数:<span style="color: red;">{{item.count}}</span></span>
						</p>

					</div>
				</template>
				<template slot="description">
					<div style="text-indent: 2em;">
						<p>发生时间:{{item.time1}}</p>
						<p>更新时间:{{item.lastUpdateTime1}}</p>
						<p v-show="item.type == 0"><span style="color: red;">当前值:{{item.curValue}} </span>&nbsp;&nbsp; 最大:{{item.maxValue}}
							&nbsp;&nbsp; 最小:{{item.minValue}}</p>
						<p><span style="color: red;">内容:{{item.content}}</span></p>
						<p><span style="color: #19be6b;">帮助:{{item.help}}</span></p>
					</div>
				</template>
			</ListItemMeta>
			<template slot="action">
				<li>
					<a v-show="!item.readed" @click="readMessageInfo(item)">阅读</a>
					<p v-show="item.readed">已阅读</p>
					<!-- <Poptip placement="left" :transfer="true" confirm title="你确定删除该信息吗?" @on-ok="delMessageInfo(item,index)">
						<p v-show="item.readed" style="color: red;">删除</p>
					</Poptip> -->
				</li>
				<!-- <li>
				<a href="">More</a>
			</li> -->
			</template>
		</ListItem>
		<div v-show="addMessage" style="text-align: center;cursor:pointer;padding: 0.625rem 0;"><a @click="getMessageListMethod">点击加载更多...</a></div>
	</List>
</template>
<script>
	import {
		getMessageList,
		enableMessage,
		delMessage
	} from '@/api/message.js'
	import {
		timestampToTime
	} from '@/libs/tools.js'
	export default {
		data() {
			return {
				addMessage:false,
				pageNo: 0,
				pageSize: 10,
				messageList: []
			}
		},
		methods: {
			delMessageInfo(item,index){
				delMessage(item.id).then(res=>{
						const data = res.data
					if (data.success == 1) {
						this.messageList.splice(index, 1);
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			readMessageInfo(item) {
				enableMessage(item.id).then(res => {
					const data = res.data
					if (data.success == 1) {
						item.readed = true
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					alert(error)
				})

			},
			getMessageListMethod() {
				getMessageList(this.pageNo, this.pageSize).then(res => {
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						if (data.messageOList) {
							var list = data.messageOList
							for (var i = 0; i < list.length; i++) {
								list[i].time1 = timestampToTime(list[i].time)
								list[i].lastUpdateTime1 = timestampToTime(list[i].lastUpdateTime)
								this.messageList.push(list[i])
							}
							if(list.length >= this.pageSize){
								this.pageNo++
								this.addMessage = true
							}else{
								this.addMessage = false
							}
						}
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					alert(error)
				})
			}
		},
		mounted() {
			this.getMessageListMethod()
		}
	}
</script>


<style>
</style>
