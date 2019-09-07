var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var sliderWidth = 96;

Page({
  data: {

    completed: false,
    selectedType: false,

    include_points: [],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    borderRadius: 5,
    latitude: 30.283145,
    longitude: 120.018341,
    markers: [
      {
        iconPath: "../../assets/phone.jpg",
        id: 1,
        latitude: 30.280050,
        longitude: 120.018400,
        width: 30,
        height: 30,
        type: "phone bin",

      },
      {
        iconPath: "../../assets/box.jpg",
        id: 2,
        latitude: 30.281840,
        longitude: 120.018640,
        width: 30,
        height: 30,
        type: "common bin"
      },
      {
        iconPath: "../../assets/box.jpg",
        id: 3,
        latitude: 30.281380,
        longitude: 120.017390,
        width: 40,
        height: 30,
        type: "common bin"
      },
      {
        iconPath: "../../assets/box.jpg",
        id: 4,
        latitude: 30.282300,
        longitude: 120.016360,
        width: 30,
        height: 30,
        type: "common bin"
      },
      {
        iconPath: "../../assets/box.jpg",
        id: 5,
        latitude: 30.282566,
        longitude: 120.018125,
        width: 30,
        height: 30
      },
      {
        iconPath: "../../assets/plastic.jpg",
        id: 6,
        latitude: 30.281426,
        longitude: 120.018876,
        width: 30,
        height: 30,
        type: "plastic bin"
      },
      {
        iconPath: "../../assets/box.jpg",
        id: 7,
        latitude: 30.281973,
        longitude: 120.017738,
        width: 30,
        height: 30,
        type: "common bin"
      },
      {
        iconPath: "../../assets/battery.jpg",
        id: 8,
        latitude: 30.280972,
        longitude: 120.017052,
        width: 30,
        height: 30,
        type: "bettary bin"
      },
    ],
    circles: [],

    controls: [

      {
        // 我的位置控件
        id: 0,
        iconPath: "../../assets/imgs_main_location@2x.png",
        position: {
          left: 10,
          top: wx.getSystemInfoSync().windowHeight - 280,
          width: 50,
          height: 50
        },
        clickable: true
      }, {
        // 红包控件
        id: 1,
        iconPath: "../../assets/location.png",
        position: {
          left: wx.getSystemInfoSync().windowWidth / 2 - 15,
          top: wx.getSystemInfoSync().windowHeight / 3 - 15,
          width: 30,
          height: 30
        },
      },
    ],
    background: ['拿东西', '送东西', '买东西'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  onShow: function (opt) {

  },

  gotohere: function (res) {
    console.log(res);
    let lat = ''; // 获取点击的markers经纬度
    let lon = ''; // 获取点击的markers经纬度
    let name = ''; // 获取点击的markers名称
    let markerId = res.markerId;// 获取点击的markers  id
    let markers = this.data.markers;// 获取markers列表
    


    for (var i=0;i<markers.length;i++) {
      var item = markers[i];
      if (item.id === markerId) {
        lat = item.latitude;
        lon = item.longitude;
        name = item.type
        console.log()
        wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
          latitude: lat,
          longitude: lon,
          name: name,
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          }
        })
        break;
      }
    }
  },
  onLoad: function (options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '4EYBZ-XESK6-LEZSM-ELKGU-NTIOK-7BBRU'
    });
    console.log(options)
    var that = this;
    //获取位置
    wx.getLocation({
      type: 'gcj02',//默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            //console.log(res);
          },
          complete: function (res) {
            //console.log(res);
          }
        })


      }
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    this.mapCtx = wx.createMapContext('qqMap');
    var that = this;
    // 调用接口


  },
  confirmLocation: function (e) {
    var that = this
    console.log(e)

  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  controltap: function (e) {
    console.log(e.controlId)
    if (e.controlId == 0) {
      this.moveToCurrentLocation()
    }
    if (e.controlId == 2) {
      wx.navigateTo({
        url: '../recharge/recharge'
      })
    }
    if (e.controlId == 3) {
      var preControls = this.data.controls
      preControls.pop();
      var markers = this.data.markers
      markers.pop()
      markers.pop()
      this.setData({
        markers: markers,
        confirm: false,
        completed: false,
        controls: preControls
      })

    }
    if (e.controlId == 4) {
      wx.navigateTo({
        url: '../index/index'
      })
    }
  },
  moveToCurrentLocation() {
    if (!this.mapCtx) {
      return;
    }

    this.mapCtx.moveToLocation();
    //this.includePoints();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    console.log(this.data.activeIndex)
  },
  mapChange: function (e) {

    var that = this;
    let mobileLocation
    var latitude = that.data.latitude;

    var longitude = that.data.longitude;
    if (e.type == "end") {
      that.mapCtx.getCenterLocation({
        success: function (res) {

          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (response) {
              console.log(response)
              if (((that.data.toX.longitude == 0) && (that.data.toX.latitude == 0))) {
                that.setData({
                  fromX: {
                    name: response.result.formatted_addresses.recommend,
                    address: response.result.address,
                    latitude: res.latitude,
                    longitude: res.longitude
                  }

                });
              }


            },
            fail: function (res) {
              //console.log(res);
            },
            complete: function (res) {
              //console.log(res);
            }
          })

        }


      })
    }


  },


});