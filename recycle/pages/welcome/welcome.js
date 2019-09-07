// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 对象
      if (user){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }).catch(err => {
      // HError  
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })

  },
  getUserInfo(data) {
    console.log(data)
    wx.showLoading({
      title: '授权登录中…',
    })
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      // user 包含用户完整信息，详见下方描述
      console.log(user)
      wx.BaaS.storage.set('userinfo',user)
      this.setData({
        userInfo: user,
        hasUserInfo: true
      })
      wx.hideLoading()
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, err => {
      // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象（详情见下方注解）
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

  }
})