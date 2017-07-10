'use strict';

System.register(['lodash', 'app/core/components/query_part/query_part'], function (_export, _context) {
  "use strict";

  var _, QueryPartDef, QueryPart, functionRenderer, suffixRenderer, identityRenderer, quotedIdentityRenderer, index, selectmenu, ordermenu, groupByTimeFunctions;

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
    return innerExpr + ' AS ' + part.params[0];
  }
  // AS策略
  function addAliasStrategy(selectParts, partModel) {
    var partCount = selectParts.length;
    if (partCount > 0) {
      // 如果selectPart,最后一个alias操作;则替换成当前订的partModel
      if (selectParts[partCount - 1].def.category === selectmenu.AS.category) {
        selectParts[partCount - 1] = partModel;
        return;
      }
    }
    // 执行追加操作
    selectParts.push(partModel);
  }
  // 自定义别名


  //======================
  // aggregation
  //======================

  // 聚合策略
  function replaceAggregationAddStrategy(selectParts, partModel) {
    // 查找现存的selectPart,然后替换最新的函数操作
    for (var i = 0; i < selectParts.length; i++) {
      var part = selectParts[i];
      // 如果是聚合函数
      if (part.def.category === selectmenu.Aggregations.category) {
        selectParts[i] = partModel;
        return;
      }
    }
    // 执行替换操作
    selectParts.splice(1, 0, partModel);
  }
  // 最大值


  //======================
  // math
  //======================
  // 算术策略
  function addMathStrategy(selectParts, partModel) {
    var partCount = selectParts.length;
    if (partCount > 0) {
      // if last is math, replace it
      if (selectParts[partCount - 1].def.category === selectmenu.Math.category) {
        selectParts[partCount - 1] = partModel;
        return;
      }
      // if next to last is math, replace it
      if (partCount > 1 && selectParts[partCount - 2].def.category === selectmenu.Math.category) {
        selectParts[partCount - 2] = partModel;
        return;
      } else if (selectParts[partCount - 1].def.category === selectmenu.AS.category) {
        // if last is alias add it before
        selectParts.splice(partCount - 1, 0, partModel);
        return;
      }
    }
    selectParts.push(partModel);
  }


  //======================
  // field
  //======================
  // 字段策略
  function addFieldStrategy(selectParts, partModel, query) {
    // 追加到OrderModels中
    query.select.push([partModel]);
  }
  //字段渲染
  function fieldRenderer(part, innerExpr) {
    if (part.params[0] === '*') {
      return '*';
    }
    return part.params[0];
  }


  // 创建新的Part
  function createPart(part) {
    var def = index[part.type];
    if (!def) {
      throw { message: 'Could not find query part ' + part.type };
    }

    return new QueryPart(part, def);
  }

  //======================
  // order
  //======================
  //字段渲染
  function orderByRenderer(part, innerExpr) {
    return part.params[0] + ' ' + part.def.type.toUpperCase();
  }
  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreComponentsQuery_partQuery_part) {
      QueryPartDef = _appCoreComponentsQuery_partQuery_part.QueryPartDef;
      QueryPart = _appCoreComponentsQuery_partQuery_part.QueryPart;
      functionRenderer = _appCoreComponentsQuery_partQuery_part.functionRenderer;
      suffixRenderer = _appCoreComponentsQuery_partQuery_part.suffixRenderer;
      identityRenderer = _appCoreComponentsQuery_partQuery_part.identityRenderer;
      quotedIdentityRenderer = _appCoreComponentsQuery_partQuery_part.quotedIdentityRenderer;
    }],
    execute: function () {
      index = [];
      selectmenu = {
        AS: { name: '重命名', category: [] }, // 别名
        Math: { name: '算术函数', category: [] }, // 算术
        Fields: { name: '新增字段', category: [] }, // 字段
        Aggregations: { name: '聚合函数', category: [] } };
      ordermenu = {
        ORDER: { name: '排序', category: [] }
      };
      register({
        type: 'as',
        addStrategy: addAliasStrategy,
        category: selectmenu.AS.category,
        params: [{ name: "name", type: "string", quote: 'double' }],
        defaultParams: ['name'],
        renderMode: 'suffix',
        renderer: aliasRenderer
      });
      // x轴
      register({
        type: 'X轴',
        addStrategy: addAliasStrategy,
        category: selectmenu.AS.category,
        params: [{ name: "name", type: "string", quote: 'double' }],
        defaultParams: ['X'],
        renderMode: 'suffix',
        renderer: function renderer(part, innerExpr) {
          return innerExpr + ' AS x';
        }
      });
      // y轴
      register({
        type: 'Y轴',
        addStrategy: addAliasStrategy,
        category: selectmenu.AS.category,
        params: [{ name: "name", type: "string", quote: 'double' }],
        defaultParams: ['Y'],
        renderMode: 'suffix',
        renderer: function renderer(part, innerExpr) {
          return innerExpr + ' AS y';
        }
      });
      // 作为图例
      register({
        type: '图例',
        addStrategy: addAliasStrategy,
        category: selectmenu.AS.category,
        params: [{ name: "name", type: "string", quote: 'double' }],
        defaultParams: ['legend'],
        renderMode: 'suffix',
        renderer: function renderer(part, innerExpr) {
          return innerExpr + ' AS legend';
        }
      });register({
        type: 'max',
        addStrategy: replaceAggregationAddStrategy,
        category: selectmenu.Aggregations.category,
        params: [],
        defaultParams: [],
        renderer: functionRenderer
      });
      // 最小值
      register({
        type: 'min',
        addStrategy: replaceAggregationAddStrategy,
        category: selectmenu.Aggregations.category,
        params: [],
        defaultParams: [],
        renderer: functionRenderer
      });

      // 求和
      register({
        type: 'sum',
        addStrategy: replaceAggregationAddStrategy,
        category: selectmenu.Aggregations.category,
        params: [],
        defaultParams: [],
        renderer: functionRenderer
      });
      // 计数 
      register({
        type: 'count',
        addStrategy: replaceAggregationAddStrategy,
        category: selectmenu.Aggregations.category,
        params: [],
        defaultParams: [],
        renderer: functionRenderer
      });
      // 唯一
      register({
        type: 'distinct',
        addStrategy: replaceAggregationAddStrategy,
        category: selectmenu.Aggregations.category,
        params: [],
        defaultParams: [],
        renderer: functionRenderer
      });register({
        type: 'math',
        addStrategy: addMathStrategy,
        category: selectmenu.Math.category,
        params: [{ name: "expr", type: "string" }],
        defaultParams: [' / 100'],
        renderer: suffixRenderer
      });register({
        type: 'field',
        addStrategy: addFieldStrategy,
        category: selectmenu.Fields.category,
        params: [{ type: 'field', dynamicLookup: true }],
        defaultParams: ['value'],
        renderer: fieldRenderer
      });;

      //======================
      // group
      //======================
      groupByTimeFunctions = [];

      register({
        type: 'time',
        category: groupByTimeFunctions,
        params: [{ name: "interval", type: "time", options: ['auto', '1s', '10s', '1m', '5m', '10m', '15m', '1h'] }],
        defaultParams: ['auto'],
        renderer: functionRenderer
      });

      register({
        type: 'fill',
        category: groupByTimeFunctions,
        params: [{ name: "fill", type: "string", options: ['none', 'null', '0', 'previous'] }],
        defaultParams: ['null'],
        renderer: functionRenderer
      });
      register({
        type: 'tag',
        category: groupByTimeFunctions,
        params: [{ name: 'tag', type: 'string', dynamicLookup: true }],
        defaultParams: ['tag'],
        renderer: fieldRenderer
      });register({
        type: 'desc',
        category: ordermenu.ORDER.category,
        params: [{ name: "desc", type: "string", dynamicLookup: true }],
        defaultParams: ['field'],
        renderer: orderByRenderer
      });

      register({
        type: 'asc',
        category: ordermenu.ORDER.category,
        params: [{ name: "asc", type: "string", dynamicLookup: true }],
        defaultParams: ['field'],
        renderer: orderByRenderer
      });

      _export('default', {
        create: createPart,
        getSelectMenu: function getSelectMenu() {
          return _.reduce(selectmenu, function (memo, cat, key) {
            var menu = {
              text: cat.name || key,
              submenu: cat.category.map(function (item) {
                return {
                  text: item.type,
                  value: item.type
                };
              })
            };
            memo.push(menu);
            return memo;
          }, []);
        },
        getOrderMenu: function getOrderMenu() {
          return _.reduce(ordermenu, function (memo, cat, key) {
            var menu = cat.category.map(function (item) {
              return {
                text: item.type,
                value: item.type
              };
            });
            memo = memo.concat(menu);
            return memo;
          }, []);
        },
        getCategory: function getCategory() {
          return selectmenu;
        }

      });
    }
  };
});
//# sourceMappingURL=query_part.js.map