var app = getApp();
var AV = require('../../utils/av-live-query-weapp-min');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SkinStyle: "normal",
    role: "",
      switch1: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'skins',
      success: function (res) {
        that.setData({
          SkinStyle: res.data
        })
      },
    })
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
  onChange(event) {
    
    const detail = event.detail;
    console.log(detail)

    this.setData({
        'switch1': detail.value
    })
      wx.setStorage({ //设置storage
          key: 'OneStyle',
          data: !detail.value,
      })
  },
  //模式的改变
  towChange(event) {
    const detail = event.detail;
    if (detail.value) {
      app.globalData.skin = "towStyle";
      this.setData({
        SkinStyle: app.globalData.skin //设置SkinStyle的值
      })
      wx.setStorage({ //设置storage
        　　　　
        key: 'skins',
        　　　　data: app.globalData.skin,
        　　
      })
    } else {
      app.globalData.skin = "normal";
      this.setData({
        SkinStyle: "normal"
      })
      wx.setStorage({　　　　
        key: 'skins',
        　　　　data: app.globalData.skin,
        　　
      })
    }

  }
})