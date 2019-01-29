// pages/UpdateWallpaper/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '约稿', //导航栏 中间的标题
      isBackShow: "false"
    },
    files: [],
    ku: 'weibo',
    title: null,
    current: 'wallpaper',
    height: app.globalData.height * 2 + 20,
    dh: app.globalData.dh,
    url: null,
    isUpload: false
  },
  onLoad() {
    this.reset();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.vibrateShort();

  },
  chooseImage: function(e) {
    let that = this
    let result = "";

    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: ret => {
        let arr = ret.tempFilePaths;
        for (let i of arr) {
          that.imgToBase64(i, (res) => {
            console.log(res)
            setTimeout(() => {
              that.uploadToWeiboMapBed(res);
            }, 100)
          })
        }
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  handleTitleChange({
    detail = {}
  }) {
    console.log(detail.detail.value, detail)
    this.setData({
      title: detail.detail.value
    });
  },
  // 添加专栏数据
  onAdd: function(url, title, photoArr) {
    let that = this
    const db = wx.cloud.database()
    db.collection('wallpaper').add({
      data: {
        url: url,
        createdAt: new Date(),
        author: 'extrastu',
        column: '益达推荐',
        downloadUrl: "",
        from: "extrastu",
        title: title,
        type: "益达推荐",
        photoArr: photoArr
      },
      success: res => {
        console.log('[数据库] [新增extrastu记录] 成功，记录 _id: ', res._id)
        wx.showToast({
          icon: 'success',
          title: '新增记录成功'
        })
        that.reset();
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
      }
    })
  },
  updateToUser() {
    wx.vibrateShort();
    if (this.data.title != null && this.data.files.length != 0) {
      this.onAdd(this.data.url, this.data.title, this.data.files)
    } else {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
    }

  },
  reset() {
    wx.vibrateShort();
    this.setData({
      files: [],
      title: null
    })
    if (this.data.isUpload) {
      wx.showToast({
        icon: 'success',
        title: '重置成功'
      })
    }
  },
  set() {
    wx.vibrateShort();
    var url = this.data.files[0]
    this.setData({
      url: url,
      files: []
    })
    console.log(this.data.files)
  },
  imgToBase64(url, callBack) {
    let base64Url = "";
    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        base64Url = 'data:image/png;base64,' + res.data;
        if (callBack) {
          callBack(base64Url)
        }
      }
    })
  },
  uploadToWeiboMapBed(base64Url) {
    let that = this;
    wx.request({
      url: 'https://api.nuolkj.com/imgfile',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        code: that.data.ku,
        img: base64Url,
        uid: 'A5255D37E4D640528D450BA2D716E490'
      },
      success: res => {
        that.setData({
          files: that.data.files.concat(res.data.data),
          isUpload: true
        })
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx;
    let array = this.data.files;
    array.splice(idx, 1)
    this.setData({
      files: array
    })
  },
  uploadImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: 'https://atqivz-8080-fqqiyt.dev.ide.live/upload',
          filePath: tempFilePaths[0],
          name: 'uploadfile_ant',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function(res) {
            console.log(res);
          },
          fail: function(res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function(res) {}
            })
          }
        });
      }
    });
  },
})