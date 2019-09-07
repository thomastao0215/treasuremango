Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    //modal的高度
    height: {
      type: String,
      value: '80%'
    },
    activity_id:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      // this.setData({show: false})
    },
    onShareAppMessage: function (res) {
      console.log(res.from)


      var shareObj = {
        title: "我分享了个设备给你",
        path: '/pages/share_device/share_device?activity_id=' + this.data.activity_id,
        imgUrl: 'https://cloud-minapp-25678.cloud.ifanrusercontent.com/BGM.jpg'
      };
      if (res.from === 'button') {
        console.log("分享设备" + shareObj.path)
        return shareObj;
      }

    },

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm() {
      this.setData({ show: false })
      this.triggerEvent('confirm')
    }
  }
})
