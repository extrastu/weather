
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: "",
        color:"",
        author:"extrastu",
        isLoading:true,
		id:"",
		avator:"",
		total:"",
		// 组件所需的参数
		nvabarData: {
			showCapsule: 1, //是否显示左上角图标
			title: '详情', //导航栏 中间的标题
			isBackShow: "false"
		},

		// 此页面 页面内容距最顶部的距离
		height1: app.globalData.height * 2 + 20,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		this.setData({
			src:options.src
		})
		this.onQuery(options.src,(res)=>{
			// console.log('[数据库] [查询记录] 成功: ',res.data.length)
			if(res.data.length>=1){
				console.log('已存在,不添加进数据库')
			}else{
				this.onAdd(options.src, Date.parse(new Date()))
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
    // 下载图片
    downloadThisImg:(e)=>{
		wx.showModal({
			content: '点击图片,进入预览长按可以保存',
			showCancel: false,
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定')
				}
			}
		});
		let that = this
        wx.vibrateShort()
        // console.log(e.currentTarget.dataset.src)
        // let src = e.currentTarget.dataset.src
        // const downloadTask =  wx.downloadFile({
        //     url: src, 
        //     success: function (res) {
               
        //         if (res.statusCode === 200) {
                   
        //             wx.saveImageToPhotosAlbum({
        //                 filePath: res.tempFilePath,
        //                 success(result) {
        //                     console.log(result)
        //                 }
        //             })

        //         }
        //     }
        // })

        // downloadTask.onProgressUpdate((res) => {
        //     console.log('下载进度', res.progress)
        //     console.log('已经下载的数据长度', res.totalBytesWritten)
        //     console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
			
			
        //     if (res.progress =="100"){
        //         wx.hideLoading()
        //         wx.vibrateShort()
        //         wx.showToast({
        //             title: '保存成功',
        //             icon: 'success',
        //             duration: 2000
        //         })
        //     }else{
        //         wx.showLoading({
        //             title: '下载中'
        //         })
        //     }
        // })

    },
    imgload: function (e) {
        this.setData({
            isLoading:false
        })
    }, 
    previewImg: function (e) {
		wx.vibrateShort()
        var imgArr = []
        imgArr.push(e.currentTarget.dataset.src)
        wx.previewImage({
            current: e.currentTarget.dataset.src, //当前图片地址
            urls: imgArr, //所有要预览的图片的地址集合 数组形式
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {}
        })
        
    },
	// 添加一条数据
	onAdd: function (currSrc,time) {
		let that = this
		const db = wx.cloud.database()
		db.collection('footprint').add({
			data: {
				src: currSrc,
				startTime: time
			},
			success: res => {
				// wx.showToast({
				// 	title: '新增记录成功',
				// })
				console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
			},
			fail: err => {
				// wx.showToast({
				// 	icon: 'none',
				// 	title: '新增记录失败'
				// })
				console.error('[数据库] [新增记录] 失败：', err)
			}
		})
	},
	// 查询指定数据
	onQuery: function (currSrc,callback) {
		const db = wx.cloud.database()
		// 查询当前用户所有的 counters
		db.collection('footprint').where({
			src:currSrc
		}).get({
			success: res => {
				this.setData({
					queryResult: JSON.stringify(res.data, null, 2)
				})
				// console.log('[数据库] [查询记录] 成功: ', res)
				if(callback){
					callback(res)
				}
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