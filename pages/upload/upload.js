var AV = require('../../utils/av-live-query-weapp-min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "自由女神像"
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
  //上传图片并更新到数据库
  uploadImg: function () {
    let that = this;
    let types = that.type;
    console.log(types)
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        res.tempFilePaths.map(tempFilePath => () => new AV.File('filename', {
          blob: {
            uri: tempFilePath,
          },
        }).save()).reduce(
          (m, p) => m.then(v => AV.Promise.all([...v, p()])),
          AV.Promise.resolve([])
        ).then(files => console.log(files.map(file => {
          console.log(file.url());
          file.url()
          var pic = AV.Object.extend('pic');
          // 新建对象
          var newPic = new pic();
          // 设置名称
          newPic.set('urls', file.url());
          console.log(types)
          newPic.set('type', types);
          // 设置优先级
          newPic.set('priority', 1);
          newPic.save().then(function (data) {
            console.log(data);
            wx.showToast({
              title: '主人我更丰满了~', //提示信息
              icon: 'success', //成功显示图标
              duration: 1000 //时间
            })
          }, function (error) {
            console.error(error);
          });
        }))).catch(console.error);
      }
    });
  }
})