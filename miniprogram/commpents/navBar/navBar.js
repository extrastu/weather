// commpents/navBar/navBar.js
const app = getApp()

Component({
	properties: {
		navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
			type: Object,
			value: {},
			observer: function (newVal, oldVal) { }
		}
	},
	data: {
		height: '',
		//默认值  默认显示左上角
		navbarData: {
			showCapsule: 1,
			isBackShow: "",
			bgColor:"#fff"
		},
		visible:false
	},
	attached: function () {
		// 获取是否是通过分享进入的小程序
		this.setData({
			share: app.globalData.share
		})
		// 定义导航栏的高度   方便对齐
		this.setData({
			height: app.globalData.height
		})
	},
	methods: {
		// 返回上一页面
		_navback() {
			wx.navigateBack()
		},
		//返回到首页
		_backhome() {
			wx.switchTab({
				url: '/pages/home/home',
			})
		},
		//进入分类页
		_toUpdate(){
			// console.log("更新页面")
			console.log(app.globalData.openid)
			wx.navigateTo({
				url: '/pages/set/set'
			})
			// if (app.globalData.openid =='oOXrt0DX_6yo3dTmJbXhssRBwGcA'){
			// 	console.log("管理员登录")
			// 	wx.navigateTo({
			// 		url: '/pages/update/update?visible=true'
			// 	})
			// }else{
			// 	console.log("进入设置皮肤")
			// 	wx.navigateTo({
			// 		url: '/pages/set/set'
			// 	})
			// }
		},
		handleOpen() {
			this.setData({
				visible: true
			});
		},
		handleClose() {
			this.setData({
				visible: false
			});
		}
	}

})


