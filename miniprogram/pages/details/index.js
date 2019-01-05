var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    srcArr: [],
    total: "",
    height: "",
    currentNum: "1",
    downloadURL: "",
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '专题', //导航栏 中间的标题,
      isBackShow: "false"
    },
    // 此页面 页面内容距最顶部的距离
    height1: app.globalData.height * 2 + 20,
    idx: "0",
    views: 0,
    _id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this

    wx.getStorage({
      key: 'photos',
      success: function(res) {
        that.setData({
          srcArr: res.data,
          idx: options.idx,
          currentNum: options.idx,
          _id: res.data[options.idx - 1]._id
        })
        that.onQuery(res.data[options.idx - 1]._id)
        that.onUpdateViews(res.data[options.idx - 1]._id)
      },
    })

    let h = app.globalData.dh - 200
    this.setData({
      height: h + "px"

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
  listenSwiper: function(e) {
    let that = this
    //打印信息
    // console.log(e.detail.current)
    let index = e.detail.current + 1
    var imgArr = that.data.srcArr

    that.setData({
      currentNum: e.detail.current + 1,
      downloadURL: imgArr[e.detail.current].url
    })
  },
  previewImg: function(e) {
    // console.log(e.currentTarget.dataset.id)
    // var index = e.currentTarget.dataset.id
    // var imgArr = this.data.srcArr
    // wx.previewImage({
    //     current: imgArr[index].src, //当前图片地址
    //     urls: [], //所有要预览的图片的地址集合 数组形式
    //     success: function(res) {},
    //     fail: function(res) {},
    //     complete: function(res) {}
    // })
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
  // downloadThisImg: (e) => {
  //   wx.vibrateShort()
  //   wx.showModal({
  //     content: '点击图片,进入预览长按可以保存',
  //     showCancel: false,
  //     success: function(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //       }
  //     }
  //   });
  // },
  onUpdateViews: function(id) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('wallpaper').doc(id).update({
      data: {
        views: _.inc(10)
      },
      success: res => {
        console.info('[数据库] [更新记录] 成功：', res)
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  onQuery: function(ids) {
    let that = this
    const db = wx.cloud.database()
    db.collection('wallpaper').where({
      _id: ids
    }).get({
      success: res => {
        console.log(res)
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
  downloadThisImg: (e) => {
    // wx.showModal({
    //   content: '点击图片,进入预览长按可以保存',
    //   showCancel: false,
    //   success: function(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // });
    let that = this
    wx.vibrateShort()
    console.log(e.currentTarget.dataset.src)
    let src = e.currentTarget.dataset.src
    const downloadTask = wx.downloadFile({
      url: src,
      success: function(res) {

        if (res.statusCode === 200) {

          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(result) {
              console.log(result)
            }
          })

        }
      }
    })

    downloadTask.onProgressUpdate((res) => {
      console.log('下载进度', res.progress)
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)


      if (res.progress == "100") {
        wx.hideLoading()
        wx.vibrateShort()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '下载中'
        })
      }
    })

  }

})