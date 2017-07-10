///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import {
  QueryPartDef,
  QueryPart,
  functionRenderer,       // 函数渲染
  suffixRenderer,         // 后缀渲染
  identityRenderer,       // 正常渲染
  quotedIdentityRenderer, // 引号渲染
} from 'app/core/components/query_part/query_part';



// 操作函数
var categories = {
	  AS: [],              // 别名
	  Math: [],            // 算术
	  Fields: [],          // 字段
	  Aggregations: [],    // 聚合
};

var index = [];
// 注册函数
function register(options) {
  index[options.type] = new QueryPartDef(options);
  options.category.push(index[options.type]);
}


//======================
// as
//======================
// AS渲染
function aliasRenderer(part, innerExpr) {
  return innerExpr + ' AS ' + '"' + part.params[0] + '"';
}
// AS策略
function addAliasStrategy(selectParts, partModel) {
  var partCount = selectParts.length;
  if (partCount > 0) {
    // 如果selectPart,最后一个alias操作;则替换成当前订的partModel
    if (selectParts[partCount-1].def.type === 'alias') {
      selectParts[partCount-1] = partModel;
      return;
    }
  }
  // 执行追加操作
  selectParts.push(partModel);
}
// 自定义别名
register({
  type: 'custom',
  addStrategy: addAliasStrategy,
  category: categories.AS,
  params: [{ name: "name", type: "string", quote: 'double'}],
  defaultParams: ['custom'],
  renderMode: 'suffix',
  renderer: aliasRenderer,
});
// x轴
register({
  type: 'xAxis',
  addStrategy: addAliasStrategy,
  category: categories.AS,
  params: [{ name: "name", type: "string", quote: 'double'}],
  defaultParams: ['x'],
  renderMode: 'suffix',
  renderer: aliasRenderer,
});
// y轴
register({
  type: 'yAxis',
  addStrategy: addAliasStrategy,
  category: categories.AS,
  params: [{ name: "name", type: "string", quote: 'double'}],
  defaultParams: ['y'],
  renderMode: 'suffix',
  renderer: aliasRenderer,
});
// 作为图例
register({
  type: 'legend',
  addStrategy: addAliasStrategy,
  category: categories.AS,
  params: [{ name: "name", type: "string", quote: 'double'}],
  defaultParams: ['series'],
  renderMode: 'suffix',
  renderer: aliasRenderer,
});



//======================
// aggregation
//======================

// 聚合策略
function replaceAggregationAddStrategy(selectParts, partModel) {
  // 查找现存的selectPart,然后替换最新的函数操作
  for (var i = 0; i < selectParts.length; i++) {
    var part = selectParts[i];
    // 如果是聚合函数
    if (part.def.category === categories.Aggregations) {
      selectParts[i] = partModel;
      return;
    }
    // 如果是选择函数
    if (part.def.category === categories.Selectors) {
      selectParts[i] = partModel;
      return;
    }
  }
	// 执行替换操作
  selectParts.splice(1, 0, partModel);
}

// 计数 
register({
  type: 'count',
  addStrategy: replaceAggregationAddStrategy,
  category: categories.Aggregations,
  params: [],
  defaultParams: [],
  renderer: functionRenderer,
});
// 求和
register({
  type: 'sum',
  addStrategy: replaceAggregationAddStrategy,
  category: categories.Aggregations,
  params: [],
  defaultParams: [],
  renderer: functionRenderer,
});
// 唯一
register({
  type: 'distinct',
  addStrategy: replaceAggregationAddStrategy,
  category: categories.Aggregations,
  params: [],
  defaultParams: [],
  renderer: functionRenderer,
});
// 最大值
register({
  type: 'max',
  addStrategy: replaceAggregationAddStrategy,
  category: categories.Aggregations,
  params: [],
  defaultParams: [],
  renderer: functionRenderer,
});
// 最小值
register({
  type: 'min',
  addStrategy: replaceAggregationAddStrategy,
  category: categories.Aggregations,
  params: [],
  defaultParams: [],
  renderer: functionRenderer,
});

//======================
// math
//======================
// 算术策略
function addMathStrategy(selectParts, partModel) {
  var partCount = selectParts.length;
  if (partCount > 0) {
    // if last is math, replace it
    if (selectParts[partCount-1].def.type === 'math') {
      selectParts[partCount-1] = partModel;
      return;
    }
    // if next to last is math, replace it
    if (selectParts[partCount-2].def.type === 'math') {
      selectParts[partCount-2] = partModel;
      return;
    } else if (selectParts[partCount-1].def.type === 'alias') { // if last is alias add it before
      selectParts.splice(partCount-1, 0, partModel);
      return;
    }
  }
  selectParts.push(partModel);
}
register({
  type: 'math',
  addStrategy: addMathStrategy,
  category: categories.Math,
  params: [{ name: "expr", type: "string"}],
  defaultParams: [' / 100'],
  renderer: suffixRenderer,
});


//======================
// field
//======================
// 字段策略
function addFieldStrategy(selectParts, partModel, query) {
  // 复制现有parts
  var parts = _.map(selectParts, function(part: any) {
    return createPart({type: part.def.type, params: _.clone(part.params)});
  });
	// 追加到selectModels中
  query.selectModels.push(parts);
}
//字段渲染
function fieldRenderer(part, innerExpr) {
  if (part.params[0] === '*')  {
    return '*';
  }
  return '"' + part.params[0] + '"';
}
register({
  type: 'field',
  addStrategy: addFieldStrategy,
  category: categories.Fields,
  params: [{type: 'field', dynamicLookup: true}],
  defaultParams: ['value'],
  renderer: fieldRenderer,
});




//======================
// 其他
//======================
var groupByTimeFunctions = [];
register({
  type: 'time',
  category: groupByTimeFunctions,
  params: [{ name: "interval", type: "time", options: ['auto', '1s', '10s', '1m', '5m', '10m', '15m', '1h'] }],
  defaultParams: ['auto'],
  renderer: functionRenderer,
});

register({
  type: 'fill',
  category: groupByTimeFunctions,
  params: [{ name: "fill", type: "string", options: ['none', 'null', '0', 'previous'] }],
  defaultParams: ['null'],
  renderer: functionRenderer,
});
register({
  type: 'tag',
  category: groupByTimeFunctions,
  params: [{name: 'tag', type: 'string', dynamicLookup: true}],
  defaultParams: ['tag'],
  renderer: fieldRenderer,
});



// 创建新的Part
function createPart(part): any {
  var def = index[part.type];
  if (!def) {
    throw {message: 'Could not find query part ' + part.type};
  }

  return new QueryPart(part, def);
};


export default {
  create: createPart,
  getCategories: function() {
    return categories;
  }
};
