// pages/permission/permission.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		nvabarData: {
			showCapsule: 1, //是否显示左上角图标
			title: '', //导航栏 中间的标题
			isBackShow: "false",
			bgColor: ""
		},
		// 此页面 页面内容距最顶部的距离
		height: app.globalData.height * 2 + 20,
		dh: app.globalData.dh,
		status:"开启",
		isAuth: false,
		isAuths:false,
		logged: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this
		wx.getStorage({
			key: 'isAuth',
			success: function (res) {
				console.log(res)
				that.setData({
					isAuth: res.data
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.vibrateShort()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	handleClick:function(){
		let that = this;
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							that.setData({
								isAuth:true
							})
							
							wx.setStorage({ //isAuth
								key: 'isAuth',
								data: true,
							})
							
							console.log('授权成功')
						}
					})
				}
			}
		})
	},
	onGetUserInfo: function (e) {
		if (!this.logged && e.detail.userInfo) {
			this.setData({
				logged: true
			})
		}
	},
})
