const app = getApp()
const account = require('../account');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		roomNo: '',
		userName: '',
		tapTime: '',
		template: 'bigsmall',
		users: [],
		index: 0,
    listNull:0
    
	},

	// 绑定输房间号入框
	bindRoomNo: function (e) {
		var self = this;
		self.setData({
			roomNo: e.detail.value
		});
	},
	userChange: function (e) {
   
		this.setData({
			index: e.detail.value
		})
	},
	radioChange: function (e) {
		this.setData({
			template: e.detail.value
		})
		console.log('this.data.template', this.data.template)
	},
  unlockRoom:function(){
    wx.removeStorage({
      key: 'wxId',
      success: function(res) {
        wx.showToast({
          title: '用户解绑成功，请退出重新绑定',
				icon: 'none',
				duration: 2000
			})


      },
    })

  },


	// 进入rtcroom页面
	joinRoom: function () {

		var self = this;
		// 防止两次点击操作间隔太快
		var nowTime = new Date();
		if (nowTime - this.data.tapTime < 1000) {
			return;
		}

    if(self.data.listNull ==0){
      wx.showToast({
				title: '未找到授权设备',
				icon: 'none',
				duration: 2000
			})
      return ;
    }

		// if (!self.data.roomNo) {
		// 	wx.showToast({
		// 		title: '请输入房间号',
		// 		icon: 'none',
		// 		duration: 2000
		// 	})
		// 	return
		// }

		// if (/^\d\d+$/.test(self.data.roomNo) === false) {
		// 	wx.showToast({
		// 		title: '只能为数字',
		// 		icon: 'none',
		// 		duration: 2000
		// 	})
		// 	return
		// }


    var roomId = this.data.users[this.data.index]['equNo'];

    var self = this;
    wx.request({
      url: 'https://youmowx.umo119.com/app/equipment/onlineStartPlay',
      data: {
        "equipmentNo": roomId,
        "id":"0"
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res1) {
        //that.setData({ textdata: res.data });




      },
      fail: function () {
        // fail
      },
      complete: function () {
        console.log("d");
      }
    })


		var userID = this.data.users[this.data.index]['userId'];
		var userSig = this.data.users[this.data.index]['userToken'];

   
    console.log("room"+roomId);

    var url = `../room/room?roomID=${roomId}`;

		wx.navigateTo({
			url: url
		});

		wx.showToast({
			title: '进入房间',
			icon: 'success',
			duration: 1000
		})

		self.setData({
			'tapTime': nowTime
		});
	},
  // 进入rtcroom页面
  joinRoom1: function () {

    var self = this;
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    if (self.data.listNull == 0) {
      wx.showToast({
        title: '未找到授权设备',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // if (!self.data.roomNo) {
    // 	wx.showToast({
    // 		title: '请输入房间号',
    // 		icon: 'none',
    // 		duration: 2000
    // 	})
    // 	return
    // }

    // if (/^\d\d+$/.test(self.data.roomNo) === false) {
    // 	wx.showToast({
    // 		title: '只能为数字',
    // 		icon: 'none',
    // 		duration: 2000
    // 	})
    // 	return
    // }


    var roomId = this.data.users[this.data.index]['equNo'];

    var self = this;
    wx.request({
      url: 'https://youmowx.umo119.com/app/equipment/onlineStartPlay',
      data: {
        "equipmentNo": roomId,
        "id": "1"
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res1) {
        //that.setData({ textdata: res.data });




      },
      fail: function () {
        // fail
      },
      complete: function () {
        console.log("d");
      }
    })


    var userID = this.data.users[this.data.index]['userId'];
    var userSig = this.data.users[this.data.index]['userToken'];


    console.log("room" + roomId);

    var url = `../room/room?roomID=${roomId}`;

    wx.navigateTo({
      url: url
    });

    wx.showToast({
      title: '进入房间',
      icon: 'success',
      duration: 1000
    })

    self.setData({
      'tapTime': nowTime
    });
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    var self = this;

    wx.getStorage({
      key: 'wxId',
      success: function (res) {
        if (res.data == "") {

        } else {
          wx.request({
            url: 'https://youmowx.umo119.com/app/equipment/getCommunityList',
            data: {
              "wxId": res.data
             },
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res2) {
              //that.setData({ textdata: res.data });
              //self.data.users = res2.data.data;
              if (res2.data.data.length ==0){
                self.data.listNull =0;
                self.setData({
                  listNull: 0
                })
                wx.showToast({
                  title: '未找到授权设备',
                  icon: 'none',
                  duration: 2000
                })
              }else{
                self.data.listNull = 1;
                self.setData({
                  listNull: 1
                })

              }
              

             
              self.setData({
                users:res2.data.data
              })


              console.log(JSON.stringify(res2.data.data) );
            },
            fail: function () {
              // fail
            },
            complete: function () {
              console.log("d");
            }
          })

        }

      }
    });

   
    

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
		return {
			path: '/pages/webrtc-room/index/index',
			imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
		}
	}
})