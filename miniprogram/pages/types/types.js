// pages/types/types.js
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 组件所需的参数
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标
            title: '分类', //导航栏 中间的标题
            isBackShow: "false"
        },

        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
        latests: [],
        total: "",
        style: "one",
        page: 1,
		types:"",
		spinShow:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        that.setData({
            nvabarData: {
                showCapsule: 1, //是否显示左上角图标
                title: options.type, //导航栏 中间的标题
                isBackShow: "false"
            },
			types: options.type
        })
		this.onQuery(options.type)
        wx.vibrateShort()
       
        
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
        wx.vibrateShort()
        var that = this
		let page = that.data.page
		const db = wx.cloud.database()
		db.collection('explore').where({
			tag: that.data.types
		}).limit(10).skip(page * 10).orderBy('time', 'desc').get({
			success: res => {
				this.setData({
					latests: res.data.concat(that.data.latests),
					spinShow: false,
					page: page+1
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    //点击预览图片
    previewImg: function(e) {
        wx.vibrateShort()
        var imgArr = []
        imgArr.push(e.currentTarget.dataset.src)
        wx.previewImage({
            current: e.currentTarget.dataset.src, //当前图片地址
            urls: imgArr, //所有要预览的图片的地址集合 数组形式
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {}
        })

    },
    changeStyle: function(e) {
        this.setData({
            style: e.currentTarget.dataset.style
        })
    },
	onQuery: function (type) {
		const db = wx.cloud.database()
		db.collection('explore').where({
			tag: type
		}).limit(10).orderBy('time', 'desc').get({
			success: res => {
				this.setData({
					latests: res.data,
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
	}
})