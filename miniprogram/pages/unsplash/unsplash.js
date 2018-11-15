// pages/unsplash/unsplash.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标
            title: 'Unsplash', //导航栏 中间的标题
            isBackShow: "false",
            bgColor: ""
        },
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
        dh: app.globalData.dh,
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        expertList: [{ //假数据
            img: "avatar.png",
            name: "欢顔",
            tag: "知名情感博主",
            answer: 134,
            listen: 2234
        }],
		photoArr:[],
		current: 'tab1',
		current_scroll: 'tab1',
		spinShow:true

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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
	// 滚动切换标签样式
	switchTab: function (e) {
		console.log(e.detail.current)
		this.setData({
			photoArr:[],
			spinShow: true,
			currentTab: e.detail.current
		})
		switch (e.detail.current) {
			case 0:
				this.search('Wallpapers')
				break;
			case 1:
				this.search('Textures & Patterns')
				break;
			case 2:
				this.search('Nature')
				break;
			default:
				this.search('Wallpapers')
		}
		this.checkCor();
		
	},
	// 点击标题切换当前页时改变样式
	swichNav: function (e) {
		var cur = e.target.dataset.current;
		if (this.data.currentTaB == cur) { return false; }
		else {
			this.setData({
				currentTab: cur
			})
		}
	},
	//判断当前滚动超过一屏时，设置tab标题滚动条。
	checkCor: function () {
		if (this.data.currentTab > 3) {
			this.setData({
				scrollLeft: this.data.currentTab*100
			})
		} else {
			this.setData({
				scrollLeft: 0
			})
		}
	},
	search: function (key) {
		let that = this
		let val = key
		let dataObj = JSON.stringify({
			key: val
		})

		that.setData({
			spinShow: true
		})
		wx.request({
			url: 'https://www.extrastu.xin/search',
			method: "POST",
			data: dataObj,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				wx.vibrateShort()
				if (res.data.length == 0) {
					$Toast({
						content: '什么也没有找到'
					})
				} else {
					that.setData({
						photoArr: res.data,
						spinShow: false,
						isComplie: true
					})
				}

			}
		})
	},
	onLoad: function () {
		var that = this;
		//  高度自适应
		wx.getSystemInfo({
			success: function (res) {
				var clientHeight = res.windowHeight,
					clientWidth = res.windowWidth,
					rpxR = 750 / clientWidth;
				var calc = clientHeight * rpxR - 180;
				console.log(calc)
				that.setData({
					winHeight: calc
				});
			}
		});
		that.search('Wallpapers')
	},
	footerTap: app.footerTap,
	handleChange({ detail }) {
		this.setData({
			current: detail.key
		});
	},

	handleChangeScroll({ detail }) {
		this.setData({
			current_scroll: detail.key
		});
	}
})