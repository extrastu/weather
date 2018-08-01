const AV = require('../../utils/av-live-query-weapp-min');
const LIMIT = 7;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    featured: []
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
    wx.showLoading({
      title: '加载中',
    })
    this.fetchTypes();
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
    this.setData({
      featured: []
    })
    wx.stopPullDownRefresh();
    this.fetchTypes();
    wx.vibrateShort();
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
  // 点击分类进行预览
  previewImg: function (e) {
    console.log(e);
    let data = JSON.stringify(e.currentTarget.dataset.list);
    wx.navigateTo({
      url: '../info/info?data=' + data
    })
  },
  //获取精选list
  fetchTypes: function () {
    var that = this;
    let typeList = [];
    new AV.Query('featured')
      .descending('createdAt').limit(7)
      .find()
      .then(data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let object = data[i];
          let res = object._serverData;
          let updatedAt = object.updatedAt;
          res.updateTime = updatedAt;
          typeList.push(res);

        }
        console.log(typeList)
        wx.hideLoading();
        that.setData({
          featured: typeList
        })
      })
      .catch(console.error);

  }
})