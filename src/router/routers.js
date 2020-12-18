// import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Login - 登录',
			hideInMenu: true
		},
		// component: () => import('@/view/login/login.vue')
		component: resolve => require(['@/view/login/login.vue'], resolve)
	},
	{
		path: '/',
		name: '_home',
		redirect: '/home',
		// component: Main,
		component: resolve => require(['@/components/main'], resolve),
		meta: {
			hideInMenu: true,
			notCache: true
		},
		children: [{
			path: '/home',
			name: 'home',
			meta: {
				hideInMenu: true,
				title: '首页',
				notCache: true,
				icon: 'md-home'
			},
			// component: () => import('@/view/single-page/home')
			component: resolve => require(['@/view/single-page/home'], resolve)
		}]
	},
	{
		path: '/org_management',
		name: 'org_management',
		meta: {
			icon: '',
			title: '组织管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'new_org',
				name: 'new_org',
				meta: {
					icon: ' iconfont icon-add',
					title: '新建组织',
					 keepAlive: true
				},
				component: resolve => require(['@/view/page/org-management/new-org/new-org.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/org/newOrg/newOrg.vue')
			},

			{
				path: 'org_list',
				name: 'org_list',
				meta: {
					icon: ' iconfont icon-orgList',
					title: '组织列表'
				},
				component: resolve => require(['@/view/page/org-management/org-list/org-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/org/orgLists/orgLists.vue')
			},
			{
				path: 'm_new_org',
				name: 'm_new_org',
				meta: {
					icon: ' iconfont icon-add',
					title: '新建组织',
					 keepAlive: true
				},
				component: resolve => require(['@/view/m-page/m-org/m-new-org.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: 'm_org_list',
				name: 'm_org_list',
				meta: {
					icon: ' iconfont icon-add',
					title: '组织列表'
				},
				component: resolve => require(['@/view/m-page/m-org/m-org-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
		]
	},
	{
		path: '/rtu_management',
		name: 'rtu_management',
		meta: {
			icon: ' iconfont icon-rtu',
			title: '设备管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'new_rtu',
				name: 'new_rtu',
				meta: {
					icon: ' iconfont icon-add',
					title: '新建设备',
					 keepAlive: true
				},
				component: resolve => require(['@/view/page/rtu-management/new-rtu/new-rtu.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/rtu/newrtu/newrtu.vue')
			},
			{
				path: 'rtu_list',
				name: 'rtu_list',
				meta: {
					icon: ' iconfont icon-rtuList',
					title: '设备列表'
				},
				component: resolve => require(['@/view/page/rtu-management/rtu-list/rtu-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/rtu/rtuLists/rtuLists.vue')
			},

		]
	},
	{
		path: '/user_management',
		name: 'user_management',
		meta: {
			icon: ' iconfont icon-user',
			title: '用户管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'add_user',
				name: 'add_user',
				meta: {
					icon: ' iconfont icon-add',
					title: '添加用户',
					 keepAlive: true
				},
				component: resolve => require(['@/view/page/user-management/add-user/add-user.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/user/addUser/addUser.vue')
			},
			{
				path: 'user_list',
				name: 'user_list',
				meta: {
					icon: ' iconfont icon-userList',
					title: '用户列表'
				},
				component: resolve => require(['@/view/page/user-management/user-list/user-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/user/userLists/userLists.vue')
			},
			{
				path: 'm_user_list',
				name: 'm_user_list',
				meta: {
					icon: ' iconfont icon-userList',
					title: '用户列表'
				},
				component: resolve => require(['@/view/m-page/m-user/m-user-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/user/userLists/userLists.vue')
			},
		]
	},
	{
		path: '/farm_management',
		name: 'farm_management',
		meta: {
			icon: ' iconfont icon-setVting',
			title: '智慧农场'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'new_farm',
				name: 'new_farm',
				meta: {
					icon: ' iconfont icon-add',
					title: '新建农场',
					 keepAlive: true
				},
				
				component: resolve => require(['@/view/page/farm-management/new-farm/new-farm.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: 'farm_list',
				name: 'farm_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '农场列表',
				},
				component: resolve => require(['@/view/page/farm-management/farm-list/farm-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
		]
	},

	{
		path: '/strategy_management',
		name: 'strategy_management',
		meta: {
			icon: ' iconfont icon-setVting',
			title: '策略管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'add_strategy',
				name: 'add_strategy',
				meta: {
					icon: ' iconfont icon-add',
					title: '添加策略',
					 keepAlive: true
				},
				component: resolve => require(['@/view/page/strategy-management/add-strategy/add-strategy.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: 'strategy_list',
				name: 'strategy_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '策略列表'
				},
				component: resolve => require(['@/view/page/strategy-management/strategy-list/strategy-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
					path: 'add_link',
					name: 'add_link',
					meta: {
						icon: ' iconfont icon-add',
						title: '添加联动',
						keepAlive: true
					},
					component: resolve => require(['@/view/page/strategy-management/add-link/add-link.vue'], resolve)
					//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
				},
			{
				path: 'link_list',
				name: 'link_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '联动列表'
				},
				component: resolve => require(['@/view/page/strategy-management/link-list/link-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
					path: 'add_timing',
					name: 'add_timing',
					meta: {
						icon: ' iconfont icon-add',
						title: '添加定时',
						keepAlive: true
					},
					component: resolve => require(['@/view/page/strategy-management/add-timing/add-timing.vue'], resolve)
					//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
				},
			{
				path: 'timing_list',
				name: 'timing_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '定时列表'
				},
				component: resolve => require(['@/view/page/strategy-management/timing-list/timing-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
					path: 'binding_link',
					name: 'binding_link',
					meta: {
						icon: ' iconfont icon-add',
						title: '绑定联动',
						keepAlive: true
					},
					component: resolve => require(['@/view/page/strategy-management/binding-link/binding-link.vue'], resolve)
					//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
				},
			{
				path: 'link_rtu',
				name: 'link_rtu',
				meta: {
					icon: ' iconfont icon-menum',
					title: '联动设备'
				},
				component: resolve => require(['@/view/page/strategy-management/link-rtu/link-rtu.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
		]
	},
	
	{
		path: '/warn_management',
		name: 'warn_management',
		meta: {
			icon: ' iconfont icon-setVting',
			title: '告警管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'add_warn',
				name: 'add_warn',
				meta: {
					icon: ' iconfont icon-add',
					title: '添加告警',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/warn-management/add-warn/add-warn.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: 'warn_list',
				name: 'warn_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '告警列表'
				},
				component: resolve => require(['@/view/page/warn-management/warn-list/warn-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'parameters_associate',
				name: 'parameters_associate',
				meta: {
					icon: ' iconfont icon-menum',
					title: '参数关联',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/warn-management/parameters-associate/parameters-associate.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'warn_rtu',
				name: 'warn_rtu',
				meta: {
					icon: ' iconfont icon-menum',
					title: '告警设备'
				},
				component: resolve => require(['@/view/page/warn-management/warn-rtu/warn-rtu.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
		]
	},
	
	{
		path: '/plot_management',
		name: 'plot_management',
		meta: {
			icon: ' iconfont icon-setVting',
			title: '数据管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'add_plot',
				name: 'add_plot',
				meta: {
					icon: ' iconfont icon-add',
					title: '添加地块',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/plot-management/add-plot/add-plot.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: 'plot_list',
				name: 'plot_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '地块列表'
				},
				component: resolve => require(['@/view/page/plot-management/plot-list/plot-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'add_data',
				name: 'add_data',
				meta: {
					icon: ' iconfont icon-menum',
					title: '添加数据',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/plot-management/add-data/add-data.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'data_list',
				name: 'data_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '数据列表'
				},
				component: resolve => require(['@/view/page/plot-management/data-list/data-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'plot_planning',
				name: 'plot_planning',
				meta: {
					icon: ' iconfont icon-menum',
					title: '地块规划',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/plot-management/plot-planning/plot-planning.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
		]
	},
	
	{
		path: '/video_management',
		name: 'video_management',
		meta: {
			icon: ' iconfont icon-setVting',
			title: '视频管理'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: 'add_brand',
				name: 'add_brand',
				meta: {
					icon: ' iconfont icon-add',
					title: '添加品牌',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/video-management/add-brand/add-brand.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: 'brand_list',
				name: 'brand_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '品牌列表'
				},
				component: resolve => require(['@/view/page/video-management/brand-list/brand-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'add_video',
				name: 'add_video',
				meta: {
					icon: ' iconfont icon-add',
					title: '添加视频',
					keepAlive: true
				},
				component: resolve => require(['@/view/page/video-management/add-video/add-video.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'video_list',
				name: 'video_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '视频列表'
				},
				component: resolve => require(['@/view/page/video-management/video-list/video-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
		]
	},
	{
		path: '/my_application',
		name: 'my_application',
		meta: {
			icon: ' iconfont icon-setVting',
			title: '我的应用'
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [
			{
				path: 'app_info',
				name: 'app_info',
				meta: {
					icon: ' iconfont icon-add',
					title: '应用信息'
				},
				component: resolve => require(['@/view/page/my-application/app-info/app-info.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
			{
				path: 'app_list',
				name: 'app_list',
				meta: {
					icon: ' iconfont icon-menum',
					title: '应用列表'
				},
				component: resolve => require(['@/view/page/my-application/app-list/app-list.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/menuManagement/menuManagement.vue')
			},
		]
	},
	
	{
		path: '/mobile_terminal',
		name: 'mobile_terminal',
		meta: {
			icon: ' iconfont icon-setVting',
			title: ''
		},
		//component: Main,
		component: resolve => require(['@/components/main'], resolve),
		children: [{
				path: '/m_rtu',
				name: 'm_rtu',
				meta: {
					icon: ' iconfont icon-add',
					title: '设备'
				},
				component: resolve => require(['@/view/m-page/m-rtu/m-rtu.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: '/m_farm',
				name: 'm_farm',
				meta: {
					icon: ' iconfont icon-add',
					title: '园区'
				},
				component: resolve => require(['@/view/m-page/m-farm/m-farm.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: '/m_strategy',
				name: 'm_strategy',
				meta: {
					icon: ' iconfont icon-add',
					title: '策略'
				},
				component: resolve => require(['@/view/m-page/m-strategy/m-strategy.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
			{
				path: '/me',
				name: 'me',
				meta: {
					icon: ' iconfont icon-add',
					title: '我'
				},
				component: resolve => require(['@/view/m-page/me/me.vue'], resolve)
				//component: () => import('@/view/intelligentgarden/setting/addMenu/addMenu.vue')
			},
		]
	},

	{
		path: '/message',
		name: 'message',
		// component: Main,
		component: resolve => require(['@/components/main'], resolve),
		meta: {
			hideInBread: true,
			hideInMenu: true
		},
		children: [{
			path: 'message_page',
			name: 'message_page',
			meta: {
				icon: 'md-notifications',
				title: '消息中心'
			},
			// component: () => import('@/view/single-page/message/index.vue')
			component: resolve => require(['@/view/single-page/message/index.vue'], resolve)
		}]
	},
	{
		path: '/401',
		name: 'error_401',
		meta: {
			hideInMenu: true
		},
		// component: () => import('@/view/error-page/401.vue')
		component: resolve => require(['@/view/error-page/401.vue'], resolve)
	},
	{
		path: '/500',
		name: 'error_500',
		meta: {
			hideInMenu: true
		},
		// component: () => import('@/view/error-page/500.vue')
		component: resolve => require(['@/view/error-page/500.vue'], resolve)
	},
	{
		path: '*',
		name: 'error_404',
		meta: {
			hideInMenu: true
		},
		// component: () => import('@/view/error-page/404.vue')
		component: resolve => require(['@/view/error-page/404.vue'], resolve)
	}
]
