<!-- 用户组件 -->
<template>

	<div>
		<List border>
			<template slot="header">
				<div style="overflow: hidden;">
					<div style="float: left;">
						<h2>{{userInfo.userName}}</h2>
						<p>{{userInfo.realName}}-{{userInfo.orgName}}</p>
					</div>
					<div style="float: right;">
						<Avatar :src="userInfo.userHeadImgUrl" size="80" />
					</div>
				</div>
			</template>
			<ListItem v-for="(item,index) in meMenuList" :key="index">
				<ListItemMeta :title="item.name">
					<template slot="avatar">
						<Avatar :icon="item.icon" />
					</template>
				</ListItemMeta>
				<template slot="action">
					<div @click="actionPlay(item)">
						<Icon type="ios-arrow-forward" size="30" />
					</div>
				</template>
			</ListItem>

		</List>

		<Modal :title="$t('change')+$t('password')" v-model="showPwd" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<reset-pwd :user-id="vmUserId"></reset-pwd>
		</Modal>
	</div>
</template>

<script>
	import ResetPwd from '@/view/page/user-management/components/reset-pwd.vue'
	import {
		refreshTokenMethod
	} from '@/api/user'
	import {
		mapMutations,
	} from 'vuex'
	// import {
	// 	setToken
	// } from '@/libs/util'
	export default {
		components: {
			 ResetPwd
		},
		data() {
			return {
				vmUserId: null, //用户ID
				showPwd: false,
				userInfo: this.$store.state.user.userInfo, //用户信息
				meMenuList: [{
						name: this.$t('change')+this.$t('password'),
						icon: 'ios-key',

					},
					// {
					// 	name:'修改售后电话',
					// 	icon:'ios-key',
					// },
					// {
					// 	name:'修改加盟热线',
					// 	icon:'ios-key',
					// }
				]
			}
		},

		computed: {

		},
		methods: {


			...mapMutations([
				'setToken'
			]),
			refrish() {
				refreshTokenMethod(this.$store.state.user.refreshToken).then(res => {
					// console.log(res)
					const data = res.data
					if (data.success == 1) {
						// console.log(data.newAccessToken)
						this.setToken(data.newAccessToken)
					}
				})
			},
			actionPlay(item) {
				if (item.name === (this.$t('change')+this.$t('password'))) {
					this.vmUserId = this.userInfo.id
					//console.log(this.vmUserId)
					this.showPwd = true
				}
			}
		}
	}
</script>

<style>
</style>
