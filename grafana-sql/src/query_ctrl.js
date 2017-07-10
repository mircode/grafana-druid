import angular from 'angular';
import _ from 'lodash';

import QueryPart    from './query_part';
import QueryModel   from './query_model';
import QueryBuilder from './query_builder';
import {QueryCtrl}  from 'app/plugins/sdk';


// 查询Controller
export class SQLQueryCtrl extends QueryCtrl {
	
  
  // 构造函数
  constructor($scope,$injector,templateSrv,$q,uiSegmentSrv) {
    super($scope, $injector);

	// 保存基本信息
	this.q = $q;
    this.target = this.target;
    this.templateSrv = templateSrv;
    this.uiSegmentSrv = uiSegmentSrv;
    
    
    // 查询Model
    this.queryModel = new QueryModel(this.target, templateSrv, this.panel.scopedVars);
    // 查询对象
    this.queryBuilder = new QueryBuilder(this.target, this.datasource.database);
    
    // 初始化Chart
    initChart();
    
    // 初始化Table
    initTable();
    // 初始化Where
    initWhere();
    // 初始化Select
    this.initSelect();
    // 初始化Group
    this.initGroup();
    
    
  }
  //=================
  // initChart相关函数
  //=================
  initChart(){
  	// 时序图和表格
    this.resultFormats = [{text: 'Time series', value: 'time_series'},{text: 'Table', value: 'table'}];
  }
  //=================
  // table相关函数
  //=================
  initTable(){
  	this.table = this.target.table ? this.uiSegmentSrv.newSegment(this.target.table) : this.uiSegmentSrv.newSelectMeasurement();
  }
  getTables() {
    return this.queryBuilder.getTables();
  }
  tableChanged() {
    this.target.table = this.table.value;
    this.panelCtrl.refresh();
  }
  
 
  //=================
  // select相关函数
  //=================
  initSelect(){
  	var categories = QueryPart.getCategories();
    this.selectMenu = _.reduce(categories, function(memo, cat, key) {
      var menu = {
        text: key,
        submenu: cat.map(item => {
         return {text: item.type, value: item.type};
        }),
      };
      memo.push(menu);
      return memo;
    }, []);
  }
  // 更改删除Select Part
  handleSelectPartEvent(selectParts, part, evt) {
    switch (evt.name) {
      // 点击字段
      case "get-param-options": {
        //var fieldsQuery = this.queryBuilder.buildExploreQuery('FIELDS');
        //return this.datasource.metricFindQuery(fieldsQuery)
        //.then(this.transformToSegments(true))
        //.catch(this.handleQueryError.bind(this));
        return 'pt_service';
      }
      // 字段值发生改变
      case "part-param-changed": {
        this.panelCtrl.refresh();
        break;
      }
      // 点击删除图标
      case "action": {
        this.queryModel.removeSelectPart(selectParts, part);
        this.panelCtrl.refresh();
        break;
      }
      // 删除图标
      case "get-part-actions": {
        return this.$q.when([{text: 'Remove', value: 'remove-part'}]);
      }
    }
  }
  // 添加Select Part
  addSelectPart(selectParts, cat, subitem) {
    this.queryModel.addSelectPart(selectParts, subitem.value);
    this.panelCtrl.refresh();
  }
 
  //=================
  // group相关函数
  //=================
  initGroup(){
    this.groupBySegment = this.uiSegmentSrv.newPlusButton();
  }
  handleGroupByPartEvent(part, index, evt) {
    switch (evt.name) {
      // 添加分组字段
      case "get-param-options": {
        var tagsQuery = this.queryBuilder.buildExploreQuery('TAG_KEYS');
        return this.datasource.metricFindQuery(tagsQuery)
        .then(this.transformToSegments(true))
        .catch(this.handleQueryError.bind(this));
      }
      // 分组字段更新
      case "part-param-changed": {
        this.panelCtrl.refresh();
        break;
      }
      // 删除分组字段
      case "action": {
        this.queryModel.removeGroupByPart(part, index);
        this.panelCtrl.refresh();
        break;
      }
      // 分组字段删除按钮
      case "get-part-actions": {
        return this.$q.when([{text: 'Remove', value: 'remove-part'}]);
      }
    }
  }
  // 分组信息
  getGroupByOptions() {
    var query = this.queryBuilder.buildExploreQuery('TAG_KEYS');

    return this.datasource.metricFindQuery(query).then(tags => {
      var options = [];
      if (!this.queryModel.hasFill()) {
        options.push(this.uiSegmentSrv.newSegment({value: 'fill(null)'}));
      }
      if (!this.queryModel.hasGroupByTime()) {
        options.push(this.uiSegmentSrv.newSegment({value: 'time($interval)'}));
      }
      for (let tag of tags) {
        options.push(this.uiSegmentSrv.newSegment({value: 'tag(' + tag.text + ')'}));
      }
      return options;
    }).catch(this.handleQueryError.bind(this));
  }
  // 更新分组
  groupByAction() {
    this.queryModel.addGroupBy(this.groupBySegment.value);
    var plusButton = this.uiSegmentSrv.newPlusButton();
    this.groupBySegment.value  = plusButton.value;
    this.groupBySegment.html  = plusButton.html;
    this.panelCtrl.refresh();
  }

  
  //=================
  // where相关函数
  //=================
  initWhere(){
  	
  	// 移除过滤条件
    this.removeTagFilterSegment = uiSegmentSrv.newSegment({fake: true, value: '-- remove tag filter --'});
    
  	// 查询条件
    this.where = [];
    
    // 拼接现有查询条件
    for (var tag in this.target.tags) {
      if (!tag.operator) {
      	// 如果tag.value是增则表达式
        if (/^\/.*\/$/.test(tag.value)) {
          tag.operator = "=~";
        } else {
          tag.operator = '=';
        }
      }
      // 查询条件 and|or
      if (tag.condition) {
        this.where.push(uiSegmentSrv.newCondition(tag.condition));
      }
      // 查询Key
      this.where.push(uiSegmentSrv.newKey(tag.key));
      // 查询操作符
      this.where.push(uiSegmentSrv.newOperator(tag.operator));
      // 查询Value
      this.where.push(uiSegmentSrv.newKeyValue(tag.value));
    }
    
    var count = this.where.length;
    var last = this.where[Math.max(count-1, 0)];

    if (!last || last.type !== 'plus-button') {
      this.where.push(this.uiSegmentSrv.newPlusButton());
    }
  }
  // Where查询条件
  getConditions(segment, index) {
  	// 链接条件
    if (segment.type === 'condition') {
      return this.$q.when([this.uiSegmentSrv.newSegment('AND'), this.uiSegmentSrv.newSegment('OR')]);
    }
    // 操作符
    if (segment.type === 'operator') {
      var nextValue = this.where[index+1].value;
      if (/^\/.*\/$/.test(nextValue)) {
        return this.$q.when(this.uiSegmentSrv.newOperators(['=~', '!~']));
      } else {
        return this.$q.when(this.uiSegmentSrv.newOperators(['=', '!=', '<>', '<', '>']));
      }
    }

    // 操作数和对应的值
    var query, addTemplateVars;
    if (segment.type === 'key' || segment.type === 'plus-button') {
      query = this.queryBuilder.buildExploreQuery('TAG_KEYS');
      addTemplateVars = false;
    } else if (segment.type === 'value')  {
      query = this.queryBuilder.buildExploreQuery('TAG_VALUES', this.where[index-2].value);
      addTemplateVars = true;
    }

    return this.datasource.metricFindQuery(query)
    .then(this.transformToSegments(addTemplateVars))
    .then(results => {
      if (segment.type === 'key') {
        results.splice(0, 0, angular.copy(this.removeTagFilterSegment));
      }
      return results;
    })
    .catch(this.handleQueryError.bind(this));
    
  }
  // 更新查询条件
  conditionChanged(segment, index) {
    this.where[index] = segment;

    // 移除条件
    if(segment.value === this.removeTagFilterSegment.value) {
      // 移除操作数、操作符和对应的值
      this.where.splice(index, 3);
      
      if (this.where.length === 0) {
        this.where.push(this.uiSegmentSrv.newPlusButton());
      } else if (this.where.length > 2) {
      	// 移除逻辑符and或者or
        this.where.splice(Math.max(index-1, 0), 1);
        if (this.where[this.where.length-1].type !== 'plus-button') {
          this.where.push(this.uiSegmentSrv.newPlusButton());
        }
      }
    } else {
      if (segment.type === 'plus-button') {
      	// 插入and逻辑符
        if (index > 2) {
          this.where.splice(index, 0, this.uiSegmentSrv.newCondition('AND'));
        }
        // 添加操作符
        this.where.push(this.uiSegmentSrv.newOperator('='));
        // 添加value
        this.where.push(this.uiSegmentSrv.newFake('select tag value', 'value', 'query-segment-value'));
        
        // 修改添加操作为key
        segment.type = 'key';
        segment.cssClass = 'query-segment-key';
      }
      // 补全添加按钮
      if ((index+1) === this.where.length) {
        this.where.push(this.uiSegmentSrv.newPlusButton());
      }
    }
	// 重新构建查询条件
    this.rebuildTargetTagConditions();
  }
  rebuildTargetTagConditions() {
    var tags = [];
    var tagIndex = 0;
    var tagOperator = "";

	// 遍历where,构造tags
    _.each(this.where, (segment2, index) => {
      if (segment2.type === 'key') {
        if (tags.length === 0) {
          tags.push({});
        }
        tags[tagIndex].key = segment2.value;
      } else if (segment2.type === 'value') {
        tagOperator = this.getTagValueOperator(segment2.value, tags[tagIndex].operator);
        if (tagOperator) {
          this.where[index-1] = this.uiSegmentSrv.newOperator(tagOperator);
          tags[tagIndex].operator = tagOperator;
        }
        tags[tagIndex].value = segment2.value;
      } else if (segment2.type === 'condition') {
        tags.push({ condition: segment2.value });
        tagIndex += 1;
      } else if (segment2.type === 'operator') {
        tags[tagIndex].operator = segment2.value;
      }
    });
	
    this.target.tags = tags;
    this.panelCtrl.refresh();
  }
  getTagValueOperator(tagValue, tagOperator) {
    if (tagOperator !== '=~' && tagOperator !== '!~' && /^\/.*\/$/.test(tagValue)) {
      return '=~';
    } else if ((tagOperator === '=~' || tagOperator === '!~') && /^(?!\/.*\/$)/.test(tagValue)) {
      return '=';
    }
  }


  

  

  

  // 切换编辑模式
  toggleEditorMode() {
    try {
      this.target.query = this.queryModel.render(false);
    } catch (err) {
      console.log('query render error');
    }
    this.target.rawQuery = !this.target.rawQuery;
  }
 
  // 错误处理
  handleQueryError(err) {
    this.error = err.message || 'Failed to issue metric query';
    return [];
  }

  // 格式转换
  transformToSegments(addTemplateVars) {
    return (results) => {
      var segments = _.map(results, segment => {
        return this.uiSegmentSrv.newSegment({ value: segment.text, expandable: segment.expandable });
      });

      if (addTemplateVars) {
        for (let variable of this.templateSrv.variables) {
          segments.unshift(this.uiSegmentSrv.newSegment({ type: 'template', value: '/^$' + variable.name + '$/', expandable: true }));
        }
      }

      return segments;
    };
  }


  getFieldSegments() {
    var fieldsQuery = this.queryBuilder.buildExploreQuery('FIELDS');
    return this.datasource.metricFindQuery(fieldsQuery)
    .then(this.transformToSegments(false))
    .catch(this.handleQueryError);
  }
  getCollapsedText() {
    return this.queryModel.render(false);
  }
}

// 模板对象
SQLQueryCtrl.templateUrl = 'partials/query.editor.html';