// pages/list/list.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标
            title: '分类', //导航栏 中间的标题
            isBackShow: "false"
        },
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
		exploreArr:[],
		spinShow:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.onQuery()
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
    onQuery: function() {
        const db = wx.cloud.database()
        db.collection('tabList').where({}).limit(10).orderBy('_id', 'desc').get({
            success: res => {
                this.setData({
                    exploreArr: res.data,
                    spinShow: false
                })
                console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    },
	intoThis: (e) => {
		let type = e.currentTarget.dataset.type
		wx.navigateTo({
			url: '../types/types?type=' + type
		})
	},
})