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
		users: account.users,
		index: 0,
    userID:'',
    userSig:'',
    roomId:""
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


	// 进入rtcroom页面
	joinRoom: function () {

		var self = this;
		// 防止两次点击操作间隔太快
		var nowTime = new Date();
		if (nowTime - this.data.tapTime < 1000) {
			return;
		}

		if (!self.data.roomNo) {
			wx.showToast({
				title: '请输入手机号',
				icon: 'none',
				duration: 2000
			})
			return
		}

		if (/^\d\d+$/.test(self.data.roomNo) === false) {
			wx.showToast({
				title: '只能为数字',
				icon: 'none',
				duration: 2000
			})
			return
		}

    

    wx.request({
      url: 'https://youmowx.umo119.com/cms/equipment/getWxId',
      data: {
        "mobile": self.data.roomNo
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res1) {
        //that.setData({ textdata: res.data });
        if (res1.data.length==0){
          wx.showToast({
            title: '找不到该手机号',
            icon: 'none',
            duration: 2000
          })

          wx.setStorage({
            key: 'wxId',
            data: ""
          });



        }else{
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            duration: 2000
          })



          wx.setStorage({
            key: 'wxId',
            data: res1.data
          });

          console.log("index1" + self.data.roomId);

          if (self.data.roomId ==""){
            wx.navigateTo({
              url: "../index/index"
            });
          }else{

            // var self = this;
            wx.request({
              url: 'https://youmowx.umo119.com/app/equipment/onlineStartPlay',
              data: {
                "equipmentNo": self.data.roomId
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

            wx.navigateTo({
              url: "../room/room?roomID=" + self.data.roomId
            });
          }

          

        }
        
       
      },
      fail: function () {
        // fail
      },
      complete: function () {
        console.log("d");
      }
    })






   
   

    // var url = `../room/room?roomID=${self.data.roomNo}`;
    // console.log(url);
		// wx.navigateTo({
		// 	url: url
		// });

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

    var self = this;

    self.data.roomId = options.roomId || '';
  

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