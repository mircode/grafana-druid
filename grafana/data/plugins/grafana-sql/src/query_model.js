import _ from 'lodash';

import QueryPart   from './query_part';
import {QueryCtrl} from 'app/plugins/sdk';
import kbn from 'app/core/utils/kbn';

// query model
export default class QueryModel {

	// constructor
	constructor(target, templateSrv, uiSegmentSrv, scopedVars) {
		// basic
		this.target = target;
		this.scopedVars = scopedVars;
		this.templateSrv = templateSrv;
		this.uiSegmentSrv = uiSegmentSrv;

		// chart type
		target.chartFormats = target.chartFormats || 'table';
		// database type
		target.dsType = 'sql';
		// editor
		target.editor=false;
		
		// table
		target.table = target.table || {value: 'select (table)',fake: true};
		// select
		target.select = target.select || [[{type: 'field',params: ['value']}]];
		// where
		target.where = target.where || [{type: 'plus-button'}];
		// group by
		target.groupBy = target.groupBy || [{type: 'plus-button'}];
		// order by
		target.orderBy = target.orderBy || [];
		// limit
		target.limit = target.limit;

	}

	// table
	getTable(interpolate) {
		var table = this.target.table;
		if(interpolate) {
			table = this.templateSrv.replace(table, this.scopedVars, 'regex');
		}
		return this.uiSegmentSrv.newSegment(table);
	}
	updateTable(segment) {
		this.target.table = segment.value;
	}
	renderTable(interpolate){
		return this.target.table;
	}
	
	// select
	getSelect() {
		return _.map(this.target.select, function(parts) {
			return _.map(parts, QueryPart.create);
		});
	}
	updateSelect(select) {
		this.target.select = _.map(select, function(selectParts) {
			return _.map(selectParts, function(part) {
				return {
					type: part.def.type,
					params: part.params
				};
			});
		});
	}
	renderSelect(){
		
		// 遍历select
		var select=_.map(this.getSelect(), function(selectParts) {
			var selectText='';
			_.map(selectParts, function(part) {
				selectText=part.render(selectText);
			});
			return selectText;
		});
		return select.join(',');
	}

	// order
	getOrderBy() {
		return _.map(this.target.orderBy, QueryPart.create);
	}
	updateOrderBy(orderBy) {
		this.target.orderBy = _.map(orderBy, function(partModel) {
			return partModel.part;
		});
	}
	renderOrderBy(){
		var order=_.map(this.getOrderBy(), function(orderPart) {
			return orderPart.render('');
		});
		return order.join(',');
	}
	// group
	getGroupBy() {
		var uiSegmentSrv = this.uiSegmentSrv;
		return _.map(this.target.groupBy, function(tag) {
			if(tag.type === 'plus-button') {
				return uiSegmentSrv.newPlusButton();
			}
			if(tag.type === 'group') {
				return uiSegmentSrv.newSegment({
					value: tag.value,
					type: 'group',
					custom: tag.value
				});
			}
		});
	}
	updateGroupBy(groupBy) {
		this.target.groupBy = _.map(groupBy, function(segment) {
			return {
				value: segment.value,
				type: segment.type
			};
		})
	}
	renderGroupBy(){
		var group=_.map(this.target.groupBy,function(field){
			if(field.value){
				return field.value;
			}
		});
		// 过滤空值
		group=_.filter(group,function(field){ return field||field==='';})
		return group.join(',');
	}
	
	// where
	getWhere() {
		var uiSegmentSrv = this.uiSegmentSrv;
		return _.map(this.target.where, function(tag) {
			//  and|or
			if(tag.type === 'condition') {
				return uiSegmentSrv.newCondition(tag.value);
			}
			if(tag.type === 'key') {
				var segment=uiSegmentSrv.newKey(tag.value);
				// field type
				segment.custom=tag.custom;
				return segment;
			}
			if(tag.type === 'plus-button') {
				return uiSegmentSrv.newPlusButton();
			}
			if(tag.type === 'value') {
				return uiSegmentSrv.newKeyValue(tag.value);
			}
			if(tag.type === 'operator') {
				return uiSegmentSrv.newOperator(tag.value);
			}
			if(tag.type === 'bracket') {
				return uiSegmentSrv.newSegment({
					value: tag.value,
					type: 'bracket',
					cssClass: 'query-segment-operator'
				});
			}
		});
	}
	updateWhere(where) {
		this.target.where = _.map(where, function(segment) {
			return {
				value: segment.value,
				type: segment.type,
				custom: segment.custom
			};
		});
	}
	renderWhere(interpolate){
		var self=this;
		var where= _.map(self.target.where, (tag, index) => {
			
			// 不需要render
			if(!interpolate) {
				return tag.value;
			}
			
			// 如果是key或者value,返回空串
			if(tag.type === 'key' || tag.type === 'value'){
				return '';
			}
			if(tag.type === 'operator'){
				var field=self.target.where[index-1];
				var opt=self.target.where[index];
				var value=self.target.where[index+1];
				var type=field.custom.toLowerCase();
				
				var val=value.value;
				var reg=/\$(\w+)|\[\[([\s\S]+?)\]\]/g;
				
				// 更具字段值,字段类型,操作类型 柯里化函数 
				var format=this.formatWhere(field.value,type,opt.value);
				// 变量替换
				if(reg.test(val)){
					val=this.templateSrv.replace(val,this.scopedVars,format);
				}else{
					val=format(val);
				}
				return val;
			}
			return tag.value;
		});
		return where.join(' ');
	}
	formatWhere(field,type,opt) {
		return function(value, variable, defaultFormatFn){
				
				if(variable&&variable.includeAll&&variable.current.text=='All'){
					var all=variable.current.value;
					return all==='$__all'?'1=1':all;					
				}
				
			     // 正则操作
				if(/=~|!~/.test(opt)){
					var pre='/^';
					var suf='$/';
				    // 多值
				    if(_.isArray(value)){
			          	var vals = _.map(value, kbn.regexEscape);
			          	value=pre+'(' + vals.join('|') + ')'+suf;
			          	
			          	return field+' '+opt+' '+value;
			         // 单值
		          	}else{
		          		value=pre+value+suf;
				        return field+' '+opt+' '+value;
		          	}
				}
				// 模糊匹配
				else if(/like|not like/.test(opt)){
					var pre="'%";
					var suf="%'";
					
				    // 多值
				    if(_.isArray(value)){
			          	var value = _.map(value, function(val){
			          		return field+' '+opt+' '+pre+val+suf;
			          	}).join(opt==='like'?' or ':' and ');
			          	
			          	return '('+value+')';
			         // 单值
		          	}else{
		          		value=pre+value+suf;
				        return field+' '+opt+' '+value;
		          	}
		          	
				}
				// 集合操作
				else if(/in|not in/.test(opt)){
					var pre='(';
					var suf=')';
				    if(_.isArray(value)){
						var vals = _.map(value, function(val){
			          		if(type.toLowerCase()==='string'){
								return "'"+val+"'"
							}
							return val;
			          	});
						value=pre+vals.join(',')+suf;
						return field+' '+opt+' '+value;
					}else{
				      	if(type.toLowerCase()==='string'){
							value="'"+value+"'"
						}
				      	value=pre+value+suf;
				      	return field+' '+opt+' '+value;
					}
				}
				else{
					 // 多值
				    if(_.isArray(value)){
			          	var vals = _.map(value, function(val){
			          		if(type.toLowerCase()==='string'){
								val="'"+val+"'"
							}
			          		return field+' '+opt+' '+val;
			          	});
			          	value=vals.join(opt==='='?' or ':' and ');
			          	return '('+value+')';
				    }else{
				      	if(type.toLowerCase()==='string'){
							value="'"+value+"'"
						}
				      	return field+' '+opt+' '+value;
				    }
				}
		}
    }
	// limit
	renderLimit(){
		return this.target.limit||'';
	}

	
	// sql
	render(interpolate) {
		var target = this.target;
		if(target.rawQuery) {
			if(interpolate) {
				return this.templateSrv.replace(target.query, this.scopedVars, 'regex');
			} else {
				return target.query;
			}
		}
		// sql
		var sql='';
		
		var select=this.renderSelect();
		var table=this.renderTable();
		var where=this.renderWhere(interpolate);
		var groupBy=this.renderGroupBy();
		var orderBy=this.renderOrderBy();
		var limit=this.renderLimit();
		
		if(select.length>0)  sql +='SELECT '+select;
		if(table.length>0)   sql +=' FROM '+table;
		if(where.length>0)   sql +=' WHERE '+where;
		if(groupBy.length>0) sql +=' GROUP BY '+groupBy;
		if(orderBy.length>0) sql +=' ORDER BY '+orderBy;
		if(limit.length>0)   sql +=' LIMIT '+limit;
		
		if(interpolate) {
        	sql = this.templateSrv.replace(sql,this.scopedVars,'regex');
      	}
		target.query=sql;
		return sql;
	}
}