var bmap = require('../../utils/bmap-wx.min.js');
var network = require('../../utils/network.js');
var AV = require('../../utils/av-live-query-weapp-min');
const {
  $Toast
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    password: ""
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
    // this.setData({
    //   show: true
    // })
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
  // 提交密码
  handleClick: function () {
    let that = this;
    console.log(that.password)
    if (that.password == "1007ljp.Z") {
      that.setData({
        show: true
      })
      $Toast({
        content: '主人,您终于来了~',
        type: 'success'
      });
    } else {
      $Toast({
        content: '不要调皮,该功能还么开发完~'
      });
    }
  },
  //上传图片并更新到数据库
  uploadImg: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //上传单个
        // var tempFilePath = res.tempFilePaths[0];
        // new AV.File('file-name', {
        //     blob: {
        //         uri: tempFilePath,
        //     },
        // }).save().then(
        //     file => {
        //         console.log(file.url());
        //         var pic = AV.Object.extend('pic');
        //         // 新建对象
        //         var newPic = new pic();
        //         // 设置名称
        //         newPic.set('urls', file.url() );
        //         // 设置优先级
        //         newPic.set('priority', 1);
        //         newPic.save().then(function (data) {
        //             console.log('objectId is ' + data);
        //         }, function (error) {
        //             console.error(error);
        //         });
        //     }

        //     ).catch(console.error);
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
  },
})