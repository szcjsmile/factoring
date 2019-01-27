/**
 * 用户信息
 */
common.pageName = "user";
common.openName = [ '8' ];

var vue = new Vue({
	el : '#user',
	data : {
		formInline:{
			type:[]
		},
		queryParam : {
			condition : {},
			pageNum : 1,
			pageSize : 10
		},
		addForm : {
			username : "",
			mobile : "",
			email : "",
			passwd : "",
            checkAllGroup:['R20190127154107XVQRJWC']
        },
		pageInfo:{},
		tableColumns:[],
		showResult:false,
		modal1:false,
        roleList:[]
	},
	created : function() {
        this.initDate();
	},
	methods : {
        /**
         * 初始化数据
         */
        initDate : function() {
            let self = this;
            this.$http.get("/role/all").then(function(response){
                if (response.data.success) {
                    self.roleList = response.data.values;
                } else {
                    self.$Message.error(response.data.errorMessage);
                }
            },function(error){
                self.$Message.error(error.data.message);
            })
        },
		/**
		 * 查询
		 */
		query : function(page){
			this.showResult=true;
			this.queryParam.pageNum = page;
			var _self = this;
            _self.queryParam.condition = _self.formInline;
			this.$http.post("/user/list", _self.queryParam).then(
					function(response) {
                        _self.pageInfo = response.data;
					}, function(error) {
                    	_self.$Message.error(error.data.message);
					})
		},
        /**
         * 状态翻译
         */
        getStatusDesc : function(value){
            if(value === 0) {
            	return "无效";
			} else if(value === 1) {
            	return "有效";
			}
            return "";
        },
		/**
		 * 新增用户
		 */
		addUser : function() {
			this.modal1 = true;
            this.addForm = {
            };
		},
        /**
		 * 保存用户信息
         */
		saveUser : function() {
            let self = this;
            if(this.addForm.id == null || this.addForm.id == ""){
                this.$http.post("/user", this.addForm).then(function(response) {
                    if (response.data.success) {
                        self.$Message.info({
                            content : "保存成功",
                            onClose : function() {
                                self.query();
                                self.cancel();
                            }
                        });
                    } else {
                        self.$Message.error(response.data.errorMessage);
                    }
                }, function(error) {
                    self.$Message.error(error.data.message);
                });
            }else{
                this.$http.put("/user", this.addForm).then(function(response) {
                    if (response.data.success) {
                        self.$Message.info({
                            content : "更新成功",
                            onClose : function() {
                                self.query();
                                self.cancel();
                            }
                        });
                    } else {
                        self.$Message.error(response.data.errorMessage);
                    }
                }, function(error) {
                    self.$Message.error(error.data.message);
                });
            }
		},
        /**
         * 删除警告
         */
        deleteWarn:function(id){
            this.$Modal.confirm({
                title: '删除提示',
                content: '<p>确认是否删除当前用户</p>',
                onOk: () => {
                    this.deleteUser(id);
                },
                onCancel: () => {}
            })
        },
        /** 删除用户 */
        deleteUser:function(id){
            let self = this;
            this.$http.delete("/user/" + id).then(function(response){
                if (response.data.success) {
                    self.$Message.info({
                        content : "删除成功",
                        onClose : function() {
                            self.query();
                            self.cancel();
                        }
                    });
                } else {
                    self.$Message.error(response.data.errorMessage);
                }
            },function(error){
                self.$Message.error(error.data.message);
            })
        },
        /**
         * 更新用户
         */
        updateUser : function(user){
            this.addForm = user;
            this.addForm.checkAllGroup = ['R20190127154107XVQRJWC']
            this.modal1 = true;
            console.log(user.roleList)
            for(var i = 0; i < this.roleList.length; i++) {
                var role = this.roleList[i];
                for(var k = 0; k < user.roleList.length; k++) {
                    if(role.serialNo === user.roleList[k].serialNo) {
                        console.log("----------------------")
                        role.checked = true;
                        break;
                    }
                }
            }
        },
		/**
		 * 取消保存
		 */
		cancel : function() {
			this.modal1 = false;
            if(this.addForm.id == '') {
                this.$refs['entityDataForm'].resetFields();
            }
		},

        /** 分页 */
        pageChange : function(page){
            this.query();
        }
	}
});

vue.tableColumns=[
    {
        title: '用户名称',
        key: 'username',
        align: 'left'
    },{
        title: '手机号',
        key: 'mobile',
        align: 'center'
    },{
        title: '邮箱',
        key: 'email',
        align: 'left'
    },{
        title: '状态',
        key: 'status',
        align: 'center',
        render:(h,param)=> {
        	return h('span', vue.getStatusDesc(param.row.status));
		}
	},{
        title: '操作',
        align: 'center',
        render:(h,param)=>{
        return h('div', [
            h('span'),
                h('Button', {
                    props: {
                        size: "small",
                        type: "warning"
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                            vue.updateUser(param.row);
                        }
                    }
                }, '编辑'),
                h('Button', {
                    props: {
                        size: "small",
                        type: "error"
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                            vue.deleteWarn(param.row.id);
                        }
                    }
                }, '删除')
                ]
            )
        }
    }
];