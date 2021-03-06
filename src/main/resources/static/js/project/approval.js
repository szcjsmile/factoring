/**
 * 菜单信息
 */
common.pageName = "approval";
common.openName = [ '1' ];

var vue = new Vue({
	el : '#approval',
	data : {
		formInline : {
			projectId : null,
			projectName : null,
			person : null,
			progress : null
		},
		addForm : {
			projectId : "",
			projectName : "",
			person : ""
		},
		queryParam : {
			condition : {},
			pageNum : 1,
			pageSize : 10
		},
		pageInfo:{},
		modal1 : false,
		statusItems : []
	},
	created : function() {
		this.initDate();
	},
	methods : {
		/**
		 * 初始化数据
		 */
		initDate : function() {
			var _self = this;
			this.$http.get("/combo/progress").then(function(response) {
				_self.statusItems = response.data;
			}, function(error) {
				console.error(error);
			})
		},
		
		/**
		 * 状态翻译
		 */
		getProgress:function(value){
			for(var index in this.statusItems){
				if(value==this.statusItems[index].value){
					return this.statusItems[index].text;
				}
			}
			return "";
		},

		/** 分页查询 */
		query : function() {
			let self = this;
			self.queryParam.condition = self.formInline;
			this.$http.post("/approval/query", self.queryParam).then(
					function(response) {
						self.pageInfo = response.data;
					}, function(error) {
						self.$Message.error(error.data.message);
					})
		},

		/** 搜索 */
		search:function(){
			this.queryParam.pageNum = 1;
			this.query();
		},
		
		/** 分页 */
		pageChange:function(page){
			this.queryParam.pageNum = page;
			this.query();
		},
		
		/**
		 * 重置
		 */
		reset:function(){
			this.$refs['searchForm'].resetFields();
		},
		
		/**
		 * 新增项目
		 */
		addProject : function() {
			this.addForm = {
				projectId:""
			};
			this.modal1 = true;
		},

		/** 保存项目 */
		saveProject : function() {
			let self = this;
			if(this.addForm.id==null||this.addForm.id==""){
				this.$http.post("/approval", this.addForm).then(function(response) {
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
				this.$http.put("/approval", this.addForm).then(function(response) {
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
		 * 更新项目
		 */
		updateProject:function(project){
			this.addForm = project;
			this.modal1 = true;
		},
		
		/**
		 * 删除警告
		 */
		deleteWarn:function(id){
			this.$Modal.confirm({
				title: '删除提示',
				content: '<p>确认是否删除当前项目</p>',
				onOk: () => {
					this.deleteProject(id);
				},
				onCancel: () => {
				}
			})
		},
		
		/** 删除项目 */
		deleteProject:function(id){
			let self = this;
			this.$http.delete("/approval/"+id).then(function(response){
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
		 * 取消保存
		 */
		cancel : function() {
			this.modal1 = false;
			this.$refs['entityDataForm'].resetFields();
		}
	}
});

vue.tableColumns=[
	{
        title: '项目编号',
        key: 'projectId',
        align: 'center'
    },{
        title: '项目名称',
        key: 'projectName',
        align: 'center'
    },{
        title: '项目负责人',
        key: 'person',
        align: 'center'
    },{
        title: '当前进度',
        key: 'progress',
        align: 'center',
        render:(h,param)=>{
        	return h('span',vue.getProgress(param.row.progress));
        }
    },{
    	title: '操作',
    	align: 'center',
        render:(h,param)=>{
        	return h('div', [
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
							 vue.updateProject(param.row);
						}
					}
				}, '编辑'),
				param.row.progress=='INIT'?
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
						}, '删除'):
						h('span')
				
			])
        }
    }
];


