const app = getApp();
const account = require('../account');

const ROLE_TYPE = {
  AUDIENCE: 'audience',
  PRESENTER: 'presenter'
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    template: 'float',
    webrtcroomComponent: null,
    roomID: '', // 房间id
    beauty: 0,
    muted: false,
    debug: false,
    frontCamera: true,
    role: ROLE_TYPE.PRESENTER, // presenter 代表主播，audience 代表观众
    userId: '',
    userSig: '',
    sdkAppID: account.sdkappid,
    isErrorModalShow: false,
    autoplay: true,
    enableCamera: true,
    smallViewLeft: 'calc(100vw - 30vw - 2vw)',
    smallViewTop: '20vw',
    smallViewWidth: '30vw',
    smallViewHeight: '40vw',
  },


  /**
   * 监听webrtc事件
   */
  onRoomEvent(e) {
    var self = this;
    switch (e.detail.tag) {
      case 'roomClosed': {
        //房间已经关闭
        wx.navigateBack({
          delta: 1
        });

        console.log("roomClosed");
        break;
      }
      case 'linkOut': {
        //连麦观众退出连麦时会收到此通知
        console.log("linkOut");
        wx.navigateBack({
          delta: 1
        });
        break;
      }
      case 'error':
        if (this.data.isErrorModalShow) { // 错误提示窗口是否已经显示
          return;
        }
        this.data.isErrorModalShow = true;
        wx.showModal({
          title: '提示',
          content: e.detail.detail,
          showCancel: false,
          complete: function () {
            self.data.isErrorModalShow = false;
            self.goBack();
          }
        });
        break;
    }
  },

  /**
   * 切换摄像头
   */
  changeCamera: function () {
    this.data.webrtcroomComponent.switchCamera();
    this.setData({
      frontCamera: !this.data.frontCamera
    })
  },

  /**
   * 开启/关闭摄像头
   */
  onEnableCameraClick: function () {
    this.data.enableCamera = !this.data.enableCamera;
    this.setData({
      enableCamera: this.data.enableCamera
    });
  },


  /**
   * 设置美颜
   */
  setBeauty: function () {
    this.data.beauty = (this.data.beauty == 0 ? 9 : 0);
    this.setData({
      beauty: this.data.beauty
    });
  },

  /**
   * 切换是否静音
   */
  changeMute: function () {
    this.data.muted = !this.data.muted;
    this.setData({
      muted: this.data.muted
    });
  },

  /**
   * 是否显示日志
   */
  showLog: function () {
    this.data.debug = !this.data.debug;
    this.setData({
      debug: this.data.debug
    });
  },

  /**
   * 进入房间
   */
  joinRoom: function () {
    // 设置webrtc-room标签中所需参数，并启动webrtc-room标签
    this.setData({
      userID: this.data.userId,
      userSig: this.data.userSig,
      sdkAppID: this.data.sdkAppID,
      roomID: this.data.roomID
    }, () => {
      this.data.webrtcroomComponent.start();
      
      
    })
  },

  /**
   * 返回上一页
   */
  goBack() {
    var pages = getCurrentPages();
    if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/webrtc-room/room/room')) {
      wx.navigateBack({
        delta: 1
      });
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {





    var self = this;
    
    self.data.roomID = options.roomID || '';

    self.setData({
      roomID: self.data.roomID
    });

    self.data.template = "bigsmall";
    self.data.webrtcroomComponent = self.selectComponent('#webrtcroom');
    self.setData({
      template: "bigsmall"
    });

    
    
    var userIds = new Date().getTime();
    wx.setStorage({
      key: 'userId',
      data: userIds
    });

    wx.request({

      url: 'https://youmowx.umo119.com/cms/equipment/getUserSig',
      data: {
        "memberId": userIds
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res1) {

        wx.setStorage({
          key: 'userSig',
          data: res1.data
        });

        self.data.userSig = res1.data;


        self.setData({
          userId: userIds
        });
        
        self.setData({
          userSig: self.data.userSig
        });

        console.log("roomId" + self.data.roomID + ",userId:" + self.data.userId + ",userSig" + self.data.userSig);
        self.joinRoom();

        // 动态设置当前页面的标题 房间号+userid
        wx.setNavigationBarTitle({
          title: self.data.roomID + '-' + self.data.userId
        })

        //检测是否在线
        setTimeout(function () {
          wx.request({
           // url: 'https://youmowx.umo119.com/cms/equipment/getWxId',
            url: 'https://youmowx.umo119.com/app/equipment/getRedisEqu',
            data: {
              "equNo": self.data.roomID
            },
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res1) {
              

              if (res1.data.data=="10"){

              }else{
                self.data.webrtcroomComponent.stop();

                if (res1.data.data == "30"){
                  wx.showToast({
                    title: '无人接听,自动退出',
                    icon: 'none',
                    duration: 1000
                  })
                }else{
                  wx.showToast({
                    title: '对方已退出',
                    icon: 'none',
                    duration: 1000
                  })
                }
               

                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 1000) 

              } 



              




            },
            fail: function () {
              // fail
            },
            complete: function () {
              console.log("d");
            }
          })

         
        }, 5000) //延迟时间 这里是1秒



      },
      fail: function () {
        // fail
      },
      complete: function () {
        //  console.log("d");
      }
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
    var self = this;
    console.log('room.js onShow');
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('room.js onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    var self = this;   
    wx.request({
      url: 'https://youmowx.umo119.com/app/equipment/onlineStopPlay',
      data: {
        "equipmentNo": self.data.roomID
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res1) {
        //that.setData({ textdata: res.data });
        // wx.navigateBack({
        //   delta: 1
        // });



      },
      fail: function () {
        // fail
        // wx.navigateBack({
        //   delta: 1
        // });

      },
      complete: function () {
        console.log("d");
        // wx.navigateBack({
        //   delta: 1
        // });
      }
    })
    
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
    return {
      // title: '',
      path: '/pages/webrtc-room/index/index',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  },


  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
})