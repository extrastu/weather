// pages/link/link.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
	data: {
		nvabarData: {
			showCapsule: 1, //是否显示左上角图标
			title: '联系我❤', //导航栏 中间的标题
			isBackShow: "false",
			bgColor: ""
		},
		// 此页面 页面内容距最顶部的距离
		height: app.globalData.height * 2 + 20,
		dh: app.globalData.dh,
		current: 2,
		verticalCurrent: 2
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {

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
	handleClick() {
		const addCurrent = this.data.current + 1;
		const current = addCurrent > 2 ? 0 : addCurrent;
		this.setData({
			'current': current
		})
	}
})