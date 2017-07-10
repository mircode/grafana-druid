
import angular from 'angular';
import _ from 'lodash';

import QueryPart    from './query_part';
import QueryModel   from './query_model';
import QueryBuilder from './query_builder';
import {QueryCtrl}  from 'app/plugins/sdk';

import SQLEditor from './lib/sql_editor.js';	



// 查询Controller
export class SQLQueryCtrl extends QueryCtrl {

	// 构造函数
	constructor($scope, $injector, templateSrv, $q, uiSegmentSrv,alertSrv) {
		super($scope, $injector);

		// 保存基本信息
		this.$q = $q;
		this.target = this.target;
		this.templateSrv = templateSrv;
		this.uiSegmentSrv = uiSegmentSrv;
		this.alertSrv=alertSrv;
		
		// 查询Model
		this.model = new QueryModel(this.target, templateSrv,uiSegmentSrv, this.panel.scopedVars);
		// 查询对象
		this.queryBuilder = new QueryBuilder(this.target, this.datasource);

		// 初始化Chart
		this.initChart();
		// 初始化Table
		this.initTable();
		// 初始化Where
		this.initWhere();
		// 初始化Select
		this.initSelect();
		// 初始化Group
		this.initGroup();
		// 初始化Order
		this.initOrder();
		
		// 初始SQL编辑器
		this.initEditor();
	}

	//=================
	// chart相关函数
	//=================
	initChart() {
		// 图标类型
		this.chartFormats = [
			{text: '时序图',value: 'time_series'}, 
			{text: '表格',value: 'table'},
		];
	}
	
	//=================
	// table相关函数
	//=================
	initTable(){
		this.table=this.model.getTable();
	}
	getTables(){
		return this.queryBuilder.queryTables()
							  	.then(this.transformToSegments(true))
							  	.catch(this.handleQueryError.bind(this));
	}
	tableChanged(){
		this.model.updateTable(this.table);
		this.panelCtrl.refresh();
	}

	//=================
	// select相关函数
	//=================
	initSelect(){
		this.select=this.model.getSelect();
		this.selectMenu=QueryPart.getSelectMenu();
	}
	// 更改删除Select Part
	handleSelectPartEvent(selectParts, part, evt) {
		switch(evt.name) {
			// 点击字段
			case "get-param-options":{
				return this.queryBuilder.queryColumns()
										.then(this.transformToSegments(true))
										.catch(this.handleQueryError.bind(this));
			}
			// 字段值发生改变
			case "part-param-changed":{
				this.panelCtrl.refresh();
				break;
			}
			// 点击删除图标
			case "action":{
				this.removeSelectPart(selectParts, part);
				break;
			}
			// 删除图标
			case "get-part-actions":{
				return this.$q.when([{
					text: 'Remove',
					value: 'remove-part'
				}]);
			}
		}
	}
	// 添加Select Part
	addSelectPart(selectParts, cat, subitem) {
		
		// 创建QueryPart
		var part = QueryPart.create({type: subitem.value});
	    part.def.addStrategy(selectParts, part, this);
	    
	    // 持久化select信息
	    this.model.updateSelect(this.select);
	    
		this.panelCtrl.refresh();
	}
	// 删除Select Part
	removeSelectPart(selectParts, part){
		// 如果删除的是field,则整个statement都删除
	    if (part.def.type === 'field') {
	      if (this.select.length > 1) {
	        var modelsIndex = _.indexOf(this.select, selectParts);
	        this.select.splice(modelsIndex, 1);
	      }
	    } else {
	      var partIndex = _.indexOf(selectParts, part);
	      selectParts.splice(partIndex, 1);
	    }
 		// 持久化select信息
		this.model.updateSelect(this.select);
		this.panelCtrl.refresh();
	}
	
	//=================
	// order相关函数
	//=================
	initOrder(){
		this.orderBy=this.model.getOrderBy();
		this.orderMenu=QueryPart.getOrderMenu();
	}
	handleOrderByPartEvent(part, index, evt) {
		switch(evt.name) {
			// 添加分组字段
			case "get-param-options":{
				return this.queryBuilder.queryColumns()
										.then(this.transformToSegments(true,true))
										.catch(this.handleQueryError.bind(this));
			}
			// 分组字段更新
			case "part-param-changed":{
				this.panelCtrl.refresh();
				break;
			}
			// 删除分组字段
			case "action":{
				this.removeOrderPart(part, index);
				this.panelCtrl.refresh();
				break;
			}
			// 分组字段删除按钮
			case "get-part-actions":{
				return this.$q.when([{
					text: 'Remove',
					value: 'remove-part'
				}]);
			}
		}
	}
	// 添加Order Part
	addOrderPart(cat) {
		var partModel = QueryPart.create({type: cat.value, params: ['field']});
		this.orderBy.push(partModel);
		
    	this.model.updateOrderBy(this.orderBy);
		this.panelCtrl.refresh();
	}
	// 删除Order Part
	removeOrderPart(part, index){
		this.orderBy.splice(index,1);
		this.model.updateOrderBy(this.select);
		this.panelCtrl.refresh();
	}
	
	//=================
	// group相关函数
	//=================
	initGroup() {
		this.groupBy=this.model.getGroupBy();
		this.tmp={};
	}
	// 分组信息
	getGroupByOptions(segment,index) {
		
		var removeSegment = this.createSegment({
			fake: true,
			value: '移除',
			type: 'remove'
		});
		var tmp=this.tmp;
		var that=this;
  		return this.queryBuilder.queryColumns()
								.then(this.transformToSegments(true,true))
								.then(results => {
									if(segment.type!='plus-button' ){
										results.splice(0,0,angular.copy(this.removeSegment));	
									}
									results=_.filter(results, function(seg) {
										  return !tmp[seg.value];
									});
									return results;
								}).catch(this.handleQueryError.bind(this));
								
								
	}
	// 更新分组
	groupByChanged(segment,index) {
		// 删除 
		if(segment.value === this.removeSegment.value){
			// 删除已选记录
			this.tmp[this.groupBy[index].custom]=false;
			this.groupBy.splice(index,1);
		// 添加
		}else if(segment.type==='plus-button'){
			segment.type = 'group';
			segment.custom=segment.value;// 使用custom自定义属性保存segment当前的value
			// 添加已选记录
			this.tmp[segment.value]=true;
			
			this.groupBy.splice(index+1,0,this.uiSegmentSrv.newPlusButton());
		// 更新
		}else{
			this.tmp[segment.custom]=false;
			this.groupBy.splice(index,1,segment);
			this.tmp[segment.value]=true;
			segment.custom=segment.value;
		}
		
		this.model.updateGroupBy(this.groupBy);
		this.panelCtrl.refresh();
	}

	//=================
	// where相关函数
	//=================
	initWhere() {

		// 移除过滤条件
		this.removeSegment = this.createSegment({
			fake: true,
			value: '移除'
		});
		this.bracketSegment = this.createSegment({value: '括弧', type: 'bracket', cssClass: 'query-segment-operator' });

		// 查询条件
		this.where = this.model.getWhere();
		
	}
	// Where查询条件
	getWhereOptions(segment, index) {
		// 链接条件
		if(segment.type === 'condition') {
			return this.$q.when([this.createSegment('AND'), this.createSegment('OR')]);
		}
		// 括弧
		if(segment.type === 'bracket'){
			if(segment.value==='('){
				return this.$q.when([this.removeSegment]);
			}else{
				return this.$q.when([]);
			}
		}
		
		// plus-button
		if(segment.type === 'plus-button'){
			return this.queryBuilder.queryColumns()
								.then(this.transformToSegments(false,true))
								.then(results => {
									results.splice(0, 0, angular.copy(this.bracketSegment));	
									return results;
								})
								.catch(this.handleQueryError.bind(this));
		}
		// operator
		if(segment.type === 'operator') {
			return this.$q.when(this.uiSegmentSrv.newOperators(['=', '!=', ,'>','>=','<','<=','=~', '!~','in','not in','like','not like']));
		}
		
		// key
		if(segment.type === 'key'){
			return this.queryBuilder.queryColumns()
								.then(this.transformToSegments(false,true))
								.then(results => {
									results.splice(0, 0, angular.copy(this.removeSegment));
									return results;
								})
								.catch(this.handleQueryError.bind(this));
		}
		// value
		if(segment.type === 'value'){
			var field=this.where[index-2].value;
			var aliasName=this.getAliasName();
			field=aliasName[field]||field;
			return this.queryBuilder.queryColumnValue('select distinct '+field+' from '+this.target.table)
								.then(results => {
									return _.map(results,function(result){
										return {text:result.text};
									})
								})
								.then(this.transformToSegments(true))
								.then(results => {
									if(segment.type === 'key') {
										results.splice(0, 0, angular.copy(this.removeSegment));
									}
									return results;
								})
								.catch(this.handleQueryError.bind(this));
		}

	}
	// 更新查询条件
	whereChanged(segment, index) {
		
		// 删除
		if(segment.value === this.removeSegment.value){
			
			// 删除括弧
			if(segment.type===this.bracketSegment.type){
				var deep=1;
				var i=index+1;
				while(deep!=0){
					if(this.where[i].value==='('){
						deep++;
					}else if(this.where[i].value===')'){
						deep--;
						if(deep==0) break;
					}
					i++;
				}
				
				// 删除			
				var pre=this.where[index-1];
				if( index>1 && pre.type === 'condition' ){
					this.where.splice(index-1,i-index+2);
				}else{
					this.where.splice(index,i-index+1);
				}
				
			}
			// 删除key=value
			if(segment.type==='key'){
				// 移除操作数、操作符和对应的值
				this.where.splice(index, 3);
				if(this.where.length === 0) {
					this.where.push(this.uiSegmentSrv.newPlusButton());
				} else if(this.where.length > 2) {
					// 移除逻辑符and或者or
					if(this.where[Math.max(index - 1, 0)].type==='condition'){
						this.where.splice(Math.max(index - 1, 0), 1);
					}
					if(this.where[this.where.length - 1].type !== 'plus-button') {
						this.where.push(this.uiSegmentSrv.newPlusButton());
					}
				}
			}
		
		// 添加括弧
		}else if(segment.value === this.bracketSegment.value){
		
			// (+)+,(+)+ and (+)+
			var and=this.uiSegmentSrv.newCondition('AND');
			var left=this.createSegment({value: '(', type: 'bracket', cssClass: 'query-segment-operator' });
			var plus=this.uiSegmentSrv.newPlusButton();
			var right=this.createSegment({value: ')', type: 'bracket', cssClass: 'query-segment-operator' });
			var plus_out=this.uiSegmentSrv.newPlusButton();
			
			// 插入			
			var pre=this.where[index-1];
			if( index>1 && pre.value !== '(' ){
				this.where.splice(index,1,and,left,plus,right,plus_out);// and (+)+
			}else{
				this.where.splice(index,1,left,plus,right,plus_out);    // (+)+
			}
			
		// 添加key operator value
		}else if(segment.type === 'plus-button'){
			
			var and=this.uiSegmentSrv.newCondition('AND');
			var _key=segment;
			var opt=this.uiSegmentSrv.newOperator('=');
			var value=this.uiSegmentSrv.newFake('value', 'value', 'query-segment-value');
			var plus=this.uiSegmentSrv.newPlusButton();
			
			var segment_pre=this.where[index-1];
			if(index > 2 && segment_pre.value !== '(' && segment_pre.type !== 'condition') {
				this.where.splice(index,1,and,_key,opt,value,plus);
			}else{
				this.where.splice(index,1,_key,opt,value,plus);
			}
			
			// 修改添加操作为key
			segment.type = 'key';
			segment.cssClass = 'query-segment-key';
			
			// 设置字段类型
			this.queryBuilder.queryColumns().then(results => {
				var aliasName=this.getAliasName();
				var field=aliasName[segment.value]||segment.value;
				_.map(results,function(col){
					if(col.text===field){
						segment.custom=col.type;
					}
				});
			});
			
			
			
		// 修改key
		}else if(segment.type ==='key' ){
			this.where.splice(index,3);
			var _key=segment;
			var opt=this.uiSegmentSrv.newOperator('=');
			var value=this.uiSegmentSrv.newFake('value', 'value', 'query-segment-value');
			this.where.splice(index,0,_key,opt,value);
			
		}else{
			// 变更value或操作
			this.where.splice(index,1,segment);
		}
		
		this.model.updateWhere(this.where);
		this.panelCtrl.refresh();
	}
	
	
	//=================
	// 公共函数
	//=================
	
	// 切换编辑模式
	toggleEditorMode() {
      	this.target.query = this.model.render(false);
      	this.sql=this.target.query;
		this.target.rawQuery = !this.target.rawQuery;
	}
	// 编辑器
	initEditor(){
		this.sql=this.target.query;
		this.editor=this.editor||new SQLEditor();
	}
	// 格式化SQL
	format(){
		this.sql=this.editor.format(this.sql);
	}
	// 保存SQL
	save(){
		this.target.query=this.sql;
		this.alertSrv.set('消息','SQL保存成功','success',3000);
	}
	// 执行SQL
	execute(){
		this.panelCtrl.refresh();
	}
	getCollapsedText() {
		return this.model.render(false);
	}
	
	// 转换成Segments格式
	transformToSegments(addTemplateVars,addAliasName) {
			var aliasName=this.getAliasName();
			return(results) => {
				var segments = _.map(results, segment => {
					return this.createSegment({
						value: segment.text,
						expandable: segment.expandable
					});
				});
				
				// 模板变量
				if(addTemplateVars) {
					for(let variable of this.templateSrv.variables) {
						segments.unshift(this.createSegment({
							type: 'template',
							value: '$' + variable.name,
							expandable: true
						}));
					}
				}
				// 别名
				if(addAliasName){
					var self=this;
					_.map(aliasName,function(field,as){
						segments.unshift(self.createSegment({
							type: 'template',
							value: as,
							expandable: true
						}));
					})
						
				}
				return segments;
			};
		}
	// 错误处理
	handleQueryError(err) {
		this.error = err.message || 'Failed to issue metric query';
		return [];
	}
	// 创建UI显示块
	createSegment(options){
		return this.uiSegmentSrv.newSegment(options);
	}
	// 遍历select获取别名
	getAliasName(){
		var selectmenu=QueryPart.getCategory();
		var aliasName={}
		_.map(this.select, function(selectParts) {
			var field=undefined;
			var as=undefined;
			 _.map(selectParts, function(part) {
			 	if(part.def.category===selectmenu.Fields.category){
			 		field=part.params[0];
			 	}
				if(part.def.category===selectmenu.AS.category){
					as=part.params[0];
				}
			});
			if(as){
				aliasName[as]=field;
			}
		});
		return aliasName;
	}
}

// 模板对象
SQLQueryCtrl.templateUrl = 'partials/query.editor.html';