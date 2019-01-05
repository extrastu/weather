// pages/update/update.js
const app = getApp()
const {
  $Message
} = require('../../dist/base/index');
var CosCloud = require('../../lib/cos-wx-sdk-v4');
var CryptoJS = require('../../lib/crypto');
var config = require('./config');

var appid = config.appid;
var bucket = config.bucket;
var region = config.region;
var sid = config.sid;
var skey = config.skey;
var getSignature = function(once) {
  var that = this;
  var random = parseInt(Math.random() * Math.pow(2, 32));
  var now = parseInt(new Date().getTime() / 1000);
  var e = now + 60; //签名过期时间为当前+60s
  var path = ''; //多次签名这里填空
  var str = 'a=' + appid + '&k=' + sid + '&e=' + e + '&t=' + now + '&r=' + random +
    '&f=' + path + '&b=' + bucket;
  var sha1Res = CryptoJS.HmacSHA1(str, skey); //这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
  var strWordArray = CryptoJS.enc.Utf8.parse(str);
  var resWordArray = sha1Res.concat(strWordArray);
  var res = resWordArray.toString(CryptoJS.enc.Base64);
  return res;
};
var cos = new CosCloud({
  appid: appid, // APPID 必填参数
  bucket: bucket, // bucketName 必填参数
  region: region, // 地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
  progressInterval: 1000, // 控制上传进度回调间隔
  getAppSign: function(callback) { //获取签名 必填参数
    // 拿到签名之后记得调用 callback
    var res = getSignature(false); // 这个函数自己根据签名算法实现
    callback(res);
  },
  getAppSignOnce: function(callback) { //单次签名，必填参数，参考上面的注释即可
    // 填上获取单次签名的逻辑
    var res = getSignature(true); // 这个函数自己根据签名算法实现
    callback(res);
  }
});

var ERR = {
  // 其他错误码查看文档：https://www.qcloud.com/document/product/436/6059
  'ERROR_CMD_COS_PATH_CONFLICT': '文件/目录已存在',
  'ERROR_CMD_FILE_NOTEXIST': '文件/目录不存在',
  'ERROR_SAME_FILE_UPLOAD': '不能覆盖已存在文件'
};
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
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    visible: false,
    imagePath: "",
    text: "约稿",
    isShow: false,
    tag: "",
    author: "",
    des: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.isAgree) {
      this.setData({
        visible: options.visible
      })
    }
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

  handleClose() {
    this.setData({
      visible: false
    });
    app.globalData.isAgree = true
  },
  backHome() {
    this.setData({
      visible: false
    })
    app.globalData.isAgree = false
    wx.navigateBack()

  },
  doSubmit: function() {
    let that = this;
    let path = that.data.imagePath
    var filename = path.substr(path.lastIndexOf('/') + 1);
    that.loading(1, '正在上传...');
    cos.uploadFile({
      success: that.createCallBack('约稿成功'),
      error: that.createCallBack(),
      bucket: bucket,
      path: filename,
      filepath: path,
      insertOnly: 1, // insertOnly==0 表示允许覆盖文件 1表示不允许覆盖
      bizAttr: 'test-biz-val',
      onProgress: function(info) {
        console.log(info);

      }
    });


  },
  // 上传图片
  doUpload: function() {
    let that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        // wx.showLoading({
        // 	title: '上传中',
        // })

        const filePath = res.tempFilePaths[0]
        that.setData({
          imagePath: filePath,
          isShow: true,
          text: "重新约稿"
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  doAdd: function(tag1, author1, des1, id) {
    const db = wx.cloud.database()
    db.collection('wallpaper').add({
      data: {
        tag: tag1,
        author: author1,
        des: des1,
        createdAt: new Date(),
        url: id
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          isShow: false,
          text: "继续约稿"
        })
        wx.showToast({
          title: '约稿成功'
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '约稿失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  doDownload: (id) => {
    wx.cloud.downloadFile({
      fileID: id
    }).then(res => {
      // get temp file path
      console.log(res)
    }).catch(error => {
      // handle error
    })
  },
  // 回调统一处理函数
  createCallBack: function(msg) {
    var that = this;
    return function(result) {
      console.log(result);
      let urls = result.data.data.source_url
      let tags = that.data.tag
      let authors = that.data.author
      let des = that.data.des
      that.doAdd(tags, authors, des, urls)
      that.loading(0);
      if (result.errMsg != 'request:ok' && result.errMsg != 'uploadFile:ok') {
        wx.showModal({
          title: '请求出错',
          content: '请求出错：' + result.errMsg + '；状态码：' + result.statusCode,
          showCancel: false
        });
      } else if (result.data.code) {
        wx.showModal({
          title: '返回错误',
          content: (msg || '请求') + '失败：' + (ERR[result.data.message] || result.data.message) +
            '；状态码：' + result.statusCode,
          showCancel: false
        });
      } else {
        wx.showToast({
          title: (msg || '请求'),
          icon: 'success',
          duration: 3000
        });
      }
    }
  },
  // 回调统一处理函数
  loading: function(isLoading, msg) {
    if (isLoading) {
      wx.showToast({
        title: (msg || '正在请求...'),
        icon: 'loading',
        duration: 60000
      });
    } else {
      wx.hideToast();
    }
  },
  // 创建目录
  createFolder: function() {
    cos.createFolder(this.createCallBack('1. /test 目录创建'), this.createCallBack(), bucket, '/test', 'folder_first_attr'); // 最后的 bizAttr 参数可省略
  },
  // 列出目录
  getFolderList: function() {
    cos.getFolderList(this.createCallBack('2. /test 目录列出'), this.createCallBack(), bucket, '/test');
  },
  // 查询目录属性
  getFolderStat: function() {
    cos.getFolderStat(this.createCallBack('3. /test 目录属性查询'), this.createCallBack(), bucket, '/test');
  },
  // 更新目录属性
  updateFolder: function() {
    cos.updateFolder(this.createCallBack('4. /test 目录属性更新'), this.createCallBack(), bucket, '/test', 'folder_new_attr');
  },
  // 删除目录
  deleteFolder: function() {
    cos.deleteFolder(this.createCallBack('5. /test 目录删除'), this.createCallBack(), bucket, '/test');
  },
  // 简单上传文件
  uploadFile: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        if (res.tempFilePaths && res.tempFilePaths.length) {
          var tempFilePath = res.tempFilePaths[0];
          that.setData({
            imagePath: tempFilePath,
            isShow: true,
            text: "重新约稿"
          })
          // var filename = tempFilePath.substr(tempFilePath.lastIndexOf('/') + 1);
          // that.loading(1, '正在上传...');
          // cos.uploadFile({
          //     success: that.createCallBack('6. /test.png 文件上传'),
          //     error: that.createCallBack(),
          //     bucket: bucket,
          // 	path: filename,
          //     filepath: tempFilePath,
          //     insertOnly: 1, // insertOnly==0 表示允许覆盖文件 1表示不允许覆盖
          //     bizAttr: 'test-biz-val',
          //     onProgress: function(info) {
          // 		console.log(JSON.stringify(info));

          //     }
          // });
        }
      }
    });
  },
  // 查询文件属性
  getFileStat: function() {
    cos.getFileStat(this.createCallBack('7. /test.png 文件属性查询'), this.createCallBack(), bucket, '/test.png');
  },
  // 更新文件属性
  updateFile: function() {
    cos.updateFile(this.createCallBack('8. /test.png 文件属性更新'), this.createCallBack(), bucket, '/test.png', 'file_new_attr');
  },
  // 删除文件
  deleteFile: function() {
    cos.deleteFile(this.createCallBack('9. /test.png 文件删除'), this.createCallBack(), bucket, '/test.png');
  },
  // 复制文件
  copyFile: function() {
    cos.copyFile(this.createCallBack('10. /test.png 文件复制'), this.createCallBack(), bucket, '/test.png', '/test-cp.png', 0); // overWrite==0 表示不允许覆盖文件 1表示允许覆盖
  },
  // 移动文件
  moveFile: function() {
    cos.moveFile(this.createCallBack('11. /test.png 文件移动'), this.createCallBack(), bucket, '/test.png', '/test-mv.png', 0); // overWrite==0 表示不允许覆盖文件 1表示允许覆盖
  }
})