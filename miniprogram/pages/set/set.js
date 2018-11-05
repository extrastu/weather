// pages/set/set.js
const app = getApp()
const {
    $Message
} = require('../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标
            title: '设置', //导航栏 中间的标题
            isBackShow: "false"
        },
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
        visible: false,
		isAdmin:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							wx.vibrateShort()
							wx.cloud.callFunction({
								name: 'login',
								data: {},
								success: res => {
									console.log('[云函数] [login] user openid: ', res.result.openid)
									app.globalData.openid = res.result.openid;
									if (app.globalData.openid == 'oOXrt0DX_6yo3dTmJbXhssRBwGcA') {
										this.setData({
											isAdmin: true
										})
									}
								},
								fail: err => {
									console.error('[云函数] [login] 调用失败', err)
								}
							})
						}
					})
				}
			}
		})
		
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.vibrateShort()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    intoThis: function(e) {
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: '/pages/' + type + "/" + type
        })
    },
    handleOpen() {
        this.setData({
            visible: true
        });
    },
    clearStorage: function() {
        wx.clearStorage()
    },
    handleClose2() {
        this.setData({
            visible: false
        });
    },
    handleClose1() {
        this.setData({
            visible: false
        });
    },
})