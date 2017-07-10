'use strict';

System.register(['angular', 'lodash', './query_part', './query_model', './query_builder', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var angular, _, QueryPart, QueryModel, QueryBuilder, QueryCtrl, _createClass, SQLQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_query_part) {
      QueryPart = _query_part.default;
    }, function (_query_model) {
      QueryModel = _query_model.default;
    }, function (_query_builder) {
      QueryBuilder = _query_builder.default;
    }, function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('SQLQueryCtrl', SQLQueryCtrl = function (_QueryCtrl) {
        _inherits(SQLQueryCtrl, _QueryCtrl);

        // 构造函数
        function SQLQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv) {
          _classCallCheck(this, SQLQueryCtrl);

          var _this = _possibleConstructorReturn(this, (SQLQueryCtrl.__proto__ || Object.getPrototypeOf(SQLQueryCtrl)).call(this, $scope, $injector));

          // 保存基本信息
          _this.q = $q;
          _this.target = _this.target;
          _this.templateSrv = templateSrv;
          _this.uiSegmentSrv = uiSegmentSrv;

          // 查询Model
          _this.queryModel = new QueryModel(_this.target, templateSrv, _this.panel.scopedVars);
          // 查询对象
          _this.queryBuilder = new QueryBuilder(_this.target, _this.datasource.database);

          // 初始化Chart
          initChart();

          // 初始化Table
          initTable();
          // 初始化Where
          initWhere();
          // 初始化Select
          _this.initSelect();
          // 初始化Group
          _this.initGroup();

          return _this;
        }
        //=================
        // initChart相关函数
        //=================


        _createClass(SQLQueryCtrl, [{
          key: 'initChart',
          value: function initChart() {
            // 时序图和表格
            this.resultFormats = [{ text: 'Time series', value: 'time_series' }, { text: 'Table', value: 'table' }];
          }
        }, {
          key: 'initTable',
          value: function initTable() {
            this.table = this.target.table ? this.uiSegmentSrv.newSegment(this.target.table) : this.uiSegmentSrv.newSelectMeasurement();
          }
        }, {
          key: 'getTables',
          value: function getTables() {
            return this.queryBuilder.getTables();
          }
        }, {
          key: 'tableChanged',
          value: function tableChanged() {
            this.target.table = this.table.value;
            this.panelCtrl.refresh();
          }
        }, {
          key: 'initSelect',
          value: function initSelect() {
            var categories = QueryPart.getCategories();
            this.selectMenu = _.reduce(categories, function (memo, cat, key) {
              var menu = {
                text: key,
                submenu: cat.map(function (item) {
                  return { text: item.type, value: item.type };
                })
              };
              memo.push(menu);
              return memo;
            }, []);
          }
        }, {
          key: 'handleSelectPartEvent',
          value: function handleSelectPartEvent(selectParts, part, evt) {
            switch (evt.name) {
              // 点击字段
              case "get-param-options":
                {
                  //var fieldsQuery = this.queryBuilder.buildExploreQuery('FIELDS');
                  //return this.datasource.metricFindQuery(fieldsQuery)
                  //.then(this.transformToSegments(true))
                  //.catch(this.handleQueryError.bind(this));
                  return 'pt_service';
                }
              // 字段值发生改变
              case "part-param-changed":
                {
                  this.panelCtrl.refresh();
                  break;
                }
              // 点击删除图标
              case "action":
                {
                  this.queryModel.removeSelectPart(selectParts, part);
                  this.panelCtrl.refresh();
                  break;
                }
              // 删除图标
              case "get-part-actions":
                {
                  return this.$q.when([{ text: 'Remove', value: 'remove-part' }]);
                }
            }
          }
        }, {
          key: 'addSelectPart',
          value: function addSelectPart(selectParts, cat, subitem) {
            this.queryModel.addSelectPart(selectParts, subitem.value);
            this.panelCtrl.refresh();
          }
        }, {
          key: 'initGroup',
          value: function initGroup() {
            this.groupBySegment = this.uiSegmentSrv.newPlusButton();
          }
        }, {
          key: 'handleGroupByPartEvent',
          value: function handleGroupByPartEvent(part, index, evt) {
            switch (evt.name) {
              // 添加分组字段
              case "get-param-options":
                {
                  var tagsQuery = this.queryBuilder.buildExploreQuery('TAG_KEYS');
                  return this.datasource.metricFindQuery(tagsQuery).then(this.transformToSegments(true)).catch(this.handleQueryError.bind(this));
                }
              // 分组字段更新
              case "part-param-changed":
                {
                  this.panelCtrl.refresh();
                  break;
                }
              // 删除分组字段
              case "action":
                {
                  this.queryModel.removeGroupByPart(part, index);
                  this.panelCtrl.refresh();
                  break;
                }
              // 分组字段删除按钮
              case "get-part-actions":
                {
                  return this.$q.when([{ text: 'Remove', value: 'remove-part' }]);
                }
            }
          }
        }, {
          key: 'getGroupByOptions',
          value: function getGroupByOptions() {
            var _this2 = this;

            var query = this.queryBuilder.buildExploreQuery('TAG_KEYS');

            return this.datasource.metricFindQuery(query).then(function (tags) {
              var options = [];
              if (!_this2.queryModel.hasFill()) {
                options.push(_this2.uiSegmentSrv.newSegment({ value: 'fill(null)' }));
              }
              if (!_this2.queryModel.hasGroupByTime()) {
                options.push(_this2.uiSegmentSrv.newSegment({ value: 'time($interval)' }));
              }
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var tag = _step.value;

                  options.push(_this2.uiSegmentSrv.newSegment({ value: 'tag(' + tag.text + ')' }));
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              return options;
            }).catch(this.handleQueryError.bind(this));
          }
        }, {
          key: 'groupByAction',
          value: function groupByAction() {
            this.queryModel.addGroupBy(this.groupBySegment.value);
            var plusButton = this.uiSegmentSrv.newPlusButton();
            this.groupBySegment.value = plusButton.value;
            this.groupBySegment.html = plusButton.html;
            this.panelCtrl.refresh();
          }
        }, {
          key: 'initWhere',
          value: function initWhere() {

            // 移除过滤条件
            this.removeTagFilterSegment = uiSegmentSrv.newSegment({ fake: true, value: '-- remove tag filter --' });

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
            var last = this.where[Math.max(count - 1, 0)];

            if (!last || last.type !== 'plus-button') {
              this.where.push(this.uiSegmentSrv.newPlusButton());
            }
          }
        }, {
          key: 'getConditions',
          value: function getConditions(segment, index) {
            var _this3 = this;

            // 链接条件
            if (segment.type === 'condition') {
              return this.$q.when([this.uiSegmentSrv.newSegment('AND'), this.uiSegmentSrv.newSegment('OR')]);
            }
            // 操作符
            if (segment.type === 'operator') {
              var nextValue = this.where[index + 1].value;
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
            } else if (segment.type === 'value') {
              query = this.queryBuilder.buildExploreQuery('TAG_VALUES', this.where[index - 2].value);
              addTemplateVars = true;
            }

            return this.datasource.metricFindQuery(query).then(this.transformToSegments(addTemplateVars)).then(function (results) {
              if (segment.type === 'key') {
                results.splice(0, 0, angular.copy(_this3.removeTagFilterSegment));
              }
              return results;
            }).catch(this.handleQueryError.bind(this));
          }
        }, {
          key: 'conditionChanged',
          value: function conditionChanged(segment, index) {
            this.where[index] = segment;

            // 移除条件
            if (segment.value === this.removeTagFilterSegment.value) {
              // 移除操作数、操作符和对应的值
              this.where.splice(index, 3);

              if (this.where.length === 0) {
                this.where.push(this.uiSegmentSrv.newPlusButton());
              } else if (this.where.length > 2) {
                // 移除逻辑符and或者or
                this.where.splice(Math.max(index - 1, 0), 1);
                if (this.where[this.where.length - 1].type !== 'plus-button') {
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
              if (index + 1 === this.where.length) {
                this.where.push(this.uiSegmentSrv.newPlusButton());
              }
            }
            // 重新构建查询条件
            this.rebuildTargetTagConditions();
          }
        }, {
          key: 'rebuildTargetTagConditions',
          value: function rebuildTargetTagConditions() {
            var _this4 = this;

            var tags = [];
            var tagIndex = 0;
            var tagOperator = "";

            // 遍历where,构造tags
            _.each(this.where, function (segment2, index) {
              if (segment2.type === 'key') {
                if (tags.length === 0) {
                  tags.push({});
                }
                tags[tagIndex].key = segment2.value;
              } else if (segment2.type === 'value') {
                tagOperator = _this4.getTagValueOperator(segment2.value, tags[tagIndex].operator);
                if (tagOperator) {
                  _this4.where[index - 1] = _this4.uiSegmentSrv.newOperator(tagOperator);
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
        }, {
          key: 'getTagValueOperator',
          value: function getTagValueOperator(tagValue, tagOperator) {
            if (tagOperator !== '=~' && tagOperator !== '!~' && /^\/.*\/$/.test(tagValue)) {
              return '=~';
            } else if ((tagOperator === '=~' || tagOperator === '!~') && /^(?!\/.*\/$)/.test(tagValue)) {
              return '=';
            }
          }
        }, {
          key: 'toggleEditorMode',
          value: function toggleEditorMode() {
            try {
              this.target.query = this.queryModel.render(false);
            } catch (err) {
              console.log('query render error');
            }
            this.target.rawQuery = !this.target.rawQuery;
          }
        }, {
          key: 'handleQueryError',
          value: function handleQueryError(err) {
            this.error = err.message || 'Failed to issue metric query';
            return [];
          }
        }, {
          key: 'transformToSegments',
          value: function transformToSegments(addTemplateVars) {
            var _this5 = this;

            return function (results) {
              var segments = _.map(results, function (segment) {
                return _this5.uiSegmentSrv.newSegment({ value: segment.text, expandable: segment.expandable });
              });

              if (addTemplateVars) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = _this5.templateSrv.variables[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var variable = _step2.value;

                    segments.unshift(_this5.uiSegmentSrv.newSegment({ type: 'template', value: '/^$' + variable.name + '$/', expandable: true }));
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
              }

              return segments;
            };
          }
        }, {
          key: 'getFieldSegments',
          value: function getFieldSegments() {
            var fieldsQuery = this.queryBuilder.buildExploreQuery('FIELDS');
            return this.datasource.metricFindQuery(fieldsQuery).then(this.transformToSegments(false)).catch(this.handleQueryError);
          }
        }, {
          key: 'getCollapsedText',
          value: function getCollapsedText() {
            return this.queryModel.render(false);
          }
        }]);

        return SQLQueryCtrl;
      }(QueryCtrl));

      _export('SQLQueryCtrl', SQLQueryCtrl);

      // 模板对象
      SQLQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
