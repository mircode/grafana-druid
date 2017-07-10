'use strict';

System.register(['angular', 'lodash', './query_part', './query_model', './query_builder', 'app/plugins/sdk', './lib/sql_editor.js'], function (_export, _context) {
	"use strict";

	var angular, _, QueryPart, QueryModel, QueryBuilder, QueryCtrl, SQLEditor, _createClass, SQLQueryCtrl;

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
		}, function (_libSql_editorJs) {
			SQLEditor = _libSql_editorJs.default;
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
				function SQLQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv, alertSrv) {
					_classCallCheck(this, SQLQueryCtrl);

					var _this = _possibleConstructorReturn(this, (SQLQueryCtrl.__proto__ || Object.getPrototypeOf(SQLQueryCtrl)).call(this, $scope, $injector));

					// 保存基本信息
					_this.$q = $q;
					_this.target = _this.target;
					_this.templateSrv = templateSrv;
					_this.uiSegmentSrv = uiSegmentSrv;
					_this.alertSrv = alertSrv;

					// 查询Model
					_this.model = new QueryModel(_this.target, templateSrv, uiSegmentSrv, _this.panel.scopedVars);
					// 查询对象
					_this.queryBuilder = new QueryBuilder(_this.target, _this.datasource);

					// 初始化Chart
					_this.initChart();
					// 初始化Table
					_this.initTable();
					// 初始化Where
					_this.initWhere();
					// 初始化Select
					_this.initSelect();
					// 初始化Group
					_this.initGroup();
					// 初始化Order
					_this.initOrder();

					// 初始SQL编辑器
					_this.initEditor();
					return _this;
				}

				//=================
				// chart相关函数
				//=================


				_createClass(SQLQueryCtrl, [{
					key: 'initChart',
					value: function initChart() {
						// 图标类型
						this.chartFormats = [{ text: '时序图', value: 'time_series' }, { text: '表格', value: 'table' }];
					}
				}, {
					key: 'initTable',
					value: function initTable() {
						this.table = this.model.getTable();
					}
				}, {
					key: 'getTables',
					value: function getTables() {
						return this.queryBuilder.queryTables().then(this.transformToSegments(true)).catch(this.handleQueryError.bind(this));
					}
				}, {
					key: 'tableChanged',
					value: function tableChanged() {
						this.model.updateTable(this.table);
						this.panelCtrl.refresh();
					}
				}, {
					key: 'initSelect',
					value: function initSelect() {
						this.select = this.model.getSelect();
						this.selectMenu = QueryPart.getSelectMenu();
					}
				}, {
					key: 'handleSelectPartEvent',
					value: function handleSelectPartEvent(selectParts, part, evt) {
						switch (evt.name) {
							// 点击字段
							case "get-param-options":
								{
									return this.queryBuilder.queryColumns().then(this.transformToSegments(true)).catch(this.handleQueryError.bind(this));
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
									this.removeSelectPart(selectParts, part);
									break;
								}
							// 删除图标
							case "get-part-actions":
								{
									return this.$q.when([{
										text: 'Remove',
										value: 'remove-part'
									}]);
								}
						}
					}
				}, {
					key: 'addSelectPart',
					value: function addSelectPart(selectParts, cat, subitem) {

						// 创建QueryPart
						var part = QueryPart.create({ type: subitem.value });
						part.def.addStrategy(selectParts, part, this);

						// 持久化select信息
						this.model.updateSelect(this.select);

						this.panelCtrl.refresh();
					}
				}, {
					key: 'removeSelectPart',
					value: function removeSelectPart(selectParts, part) {
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
				}, {
					key: 'initOrder',
					value: function initOrder() {
						this.orderBy = this.model.getOrderBy();
						this.orderMenu = QueryPart.getOrderMenu();
					}
				}, {
					key: 'handleOrderByPartEvent',
					value: function handleOrderByPartEvent(part, index, evt) {
						switch (evt.name) {
							// 添加分组字段
							case "get-param-options":
								{
									return this.queryBuilder.queryColumns().then(this.transformToSegments(true, true)).catch(this.handleQueryError.bind(this));
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
									this.removeOrderPart(part, index);
									this.panelCtrl.refresh();
									break;
								}
							// 分组字段删除按钮
							case "get-part-actions":
								{
									return this.$q.when([{
										text: 'Remove',
										value: 'remove-part'
									}]);
								}
						}
					}
				}, {
					key: 'addOrderPart',
					value: function addOrderPart(cat) {
						var partModel = QueryPart.create({ type: cat.value, params: ['field'] });
						this.orderBy.push(partModel);

						this.model.updateOrderBy(this.orderBy);
						this.panelCtrl.refresh();
					}
				}, {
					key: 'removeOrderPart',
					value: function removeOrderPart(part, index) {
						this.orderBy.splice(index, 1);
						this.model.updateOrderBy(this.select);
						this.panelCtrl.refresh();
					}
				}, {
					key: 'initGroup',
					value: function initGroup() {
						this.groupBy = this.model.getGroupBy();
						this.tmp = {};
					}
				}, {
					key: 'getGroupByOptions',
					value: function getGroupByOptions(segment, index) {
						var _this2 = this;

						var removeSegment = this.createSegment({
							fake: true,
							value: '移除',
							type: 'remove'
						});
						var tmp = this.tmp;
						var that = this;
						return this.queryBuilder.queryColumns().then(this.transformToSegments(true, true)).then(function (results) {
							if (segment.type != 'plus-button') {
								results.splice(0, 0, angular.copy(_this2.removeSegment));
							}
							results = _.filter(results, function (seg) {
								return !tmp[seg.value];
							});
							return results;
						}).catch(this.handleQueryError.bind(this));
					}
				}, {
					key: 'groupByChanged',
					value: function groupByChanged(segment, index) {
						// 删除 
						if (segment.value === this.removeSegment.value) {
							// 删除已选记录
							this.tmp[this.groupBy[index].custom] = false;
							this.groupBy.splice(index, 1);
							// 添加
						} else if (segment.type === 'plus-button') {
							segment.type = 'group';
							segment.custom = segment.value; // 使用custom自定义属性保存segment当前的value
							// 添加已选记录
							this.tmp[segment.value] = true;

							this.groupBy.splice(index + 1, 0, this.uiSegmentSrv.newPlusButton());
							// 更新
						} else {
							this.tmp[segment.custom] = false;
							this.groupBy.splice(index, 1, segment);
							this.tmp[segment.value] = true;
							segment.custom = segment.value;
						}

						this.model.updateGroupBy(this.groupBy);
						this.panelCtrl.refresh();
					}
				}, {
					key: 'initWhere',
					value: function initWhere() {

						// 移除过滤条件
						this.removeSegment = this.createSegment({
							fake: true,
							value: '移除'
						});
						this.bracketSegment = this.createSegment({ value: '括弧', type: 'bracket', cssClass: 'query-segment-operator' });

						// 查询条件
						this.where = this.model.getWhere();
					}
				}, {
					key: 'getWhereOptions',
					value: function getWhereOptions(segment, index) {
						var _this3 = this;

						// 链接条件
						if (segment.type === 'condition') {
							return this.$q.when([this.createSegment('AND'), this.createSegment('OR')]);
						}
						// 括弧
						if (segment.type === 'bracket') {
							if (segment.value === '(') {
								return this.$q.when([this.removeSegment]);
							} else {
								return this.$q.when([]);
							}
						}

						// plus-button
						if (segment.type === 'plus-button') {
							return this.queryBuilder.queryColumns().then(this.transformToSegments(false, true)).then(function (results) {
								results.splice(0, 0, angular.copy(_this3.bracketSegment));
								return results;
							}).catch(this.handleQueryError.bind(this));
						}
						// operator
						if (segment.type === 'operator') {
							return this.$q.when(this.uiSegmentSrv.newOperators(['=', '!=',, '>', '>=', '<', '<=', '=~', '!~', 'in', 'not in', 'like', 'not like']));
						}

						// key
						if (segment.type === 'key') {
							return this.queryBuilder.queryColumns().then(this.transformToSegments(false, true)).then(function (results) {
								results.splice(0, 0, angular.copy(_this3.removeSegment));
								return results;
							}).catch(this.handleQueryError.bind(this));
						}
						// value
						if (segment.type === 'value') {
							var field = this.where[index - 2].value;
							var aliasName = this.getAliasName();
							field = aliasName[field] || field;
							return this.queryBuilder.queryColumnValue('select distinct ' + field + ' from ' + this.target.table).then(function (results) {
								return _.map(results, function (result) {
									return { text: result.text };
								});
							}).then(this.transformToSegments(true)).then(function (results) {
								if (segment.type === 'key') {
									results.splice(0, 0, angular.copy(_this3.removeSegment));
								}
								return results;
							}).catch(this.handleQueryError.bind(this));
						}
					}
				}, {
					key: 'whereChanged',
					value: function whereChanged(segment, index) {
						var _this4 = this;

						// 删除
						if (segment.value === this.removeSegment.value) {

							// 删除括弧
							if (segment.type === this.bracketSegment.type) {
								var deep = 1;
								var i = index + 1;
								while (deep != 0) {
									if (this.where[i].value === '(') {
										deep++;
									} else if (this.where[i].value === ')') {
										deep--;
										if (deep == 0) break;
									}
									i++;
								}

								// 删除			
								var pre = this.where[index - 1];
								if (index > 1 && pre.type === 'condition') {
									this.where.splice(index - 1, i - index + 2);
								} else {
									this.where.splice(index, i - index + 1);
								}
							}
							// 删除key=value
							if (segment.type === 'key') {
								// 移除操作数、操作符和对应的值
								this.where.splice(index, 3);
								if (this.where.length === 0) {
									this.where.push(this.uiSegmentSrv.newPlusButton());
								} else if (this.where.length > 2) {
									// 移除逻辑符and或者or
									if (this.where[Math.max(index - 1, 0)].type === 'condition') {
										this.where.splice(Math.max(index - 1, 0), 1);
									}
									if (this.where[this.where.length - 1].type !== 'plus-button') {
										this.where.push(this.uiSegmentSrv.newPlusButton());
									}
								}
							}

							// 添加括弧
						} else if (segment.value === this.bracketSegment.value) {

							// (+)+,(+)+ and (+)+
							var and = this.uiSegmentSrv.newCondition('AND');
							var left = this.createSegment({ value: '(', type: 'bracket', cssClass: 'query-segment-operator' });
							var plus = this.uiSegmentSrv.newPlusButton();
							var right = this.createSegment({ value: ')', type: 'bracket', cssClass: 'query-segment-operator' });
							var plus_out = this.uiSegmentSrv.newPlusButton();

							// 插入			
							var pre = this.where[index - 1];
							if (index > 1 && pre.value !== '(') {
								this.where.splice(index, 1, and, left, plus, right, plus_out); // and (+)+
							} else {
								this.where.splice(index, 1, left, plus, right, plus_out); // (+)+
							}

							// 添加key operator value
						} else if (segment.type === 'plus-button') {

							var and = this.uiSegmentSrv.newCondition('AND');
							var _key = segment;
							var opt = this.uiSegmentSrv.newOperator('=');
							var value = this.uiSegmentSrv.newFake('value', 'value', 'query-segment-value');
							var plus = this.uiSegmentSrv.newPlusButton();

							var segment_pre = this.where[index - 1];
							if (index > 2 && segment_pre.value !== '(' && segment_pre.type !== 'condition') {
								this.where.splice(index, 1, and, _key, opt, value, plus);
							} else {
								this.where.splice(index, 1, _key, opt, value, plus);
							}

							// 修改添加操作为key
							segment.type = 'key';
							segment.cssClass = 'query-segment-key';

							// 设置字段类型
							this.queryBuilder.queryColumns().then(function (results) {
								var aliasName = _this4.getAliasName();
								var field = aliasName[segment.value] || segment.value;
								_.map(results, function (col) {
									if (col.text === field) {
										segment.custom = col.type;
									}
								});
							});

							// 修改key
						} else if (segment.type === 'key') {
							this.where.splice(index, 3);
							var _key = segment;
							var opt = this.uiSegmentSrv.newOperator('=');
							var value = this.uiSegmentSrv.newFake('value', 'value', 'query-segment-value');
							this.where.splice(index, 0, _key, opt, value);
						} else {
							// 变更value或操作
							this.where.splice(index, 1, segment);
						}

						this.model.updateWhere(this.where);
						this.panelCtrl.refresh();
					}
				}, {
					key: 'toggleEditorMode',
					value: function toggleEditorMode() {
						this.target.query = this.model.render(false);
						this.sql = this.target.query;
						this.target.rawQuery = !this.target.rawQuery;
					}
				}, {
					key: 'initEditor',
					value: function initEditor() {
						this.sql = this.target.query;
						this.editor = this.editor || new SQLEditor();
					}
				}, {
					key: 'format',
					value: function format() {
						this.sql = this.editor.format(this.sql);
					}
				}, {
					key: 'save',
					value: function save() {
						this.target.query = this.sql;
						this.alertSrv.set('消息', 'SQL保存成功', 'success', 3000);
					}
				}, {
					key: 'execute',
					value: function execute() {
						this.panelCtrl.refresh();
					}
				}, {
					key: 'getCollapsedText',
					value: function getCollapsedText() {
						return this.model.render(false);
					}
				}, {
					key: 'transformToSegments',
					value: function transformToSegments(addTemplateVars, addAliasName) {
						var _this5 = this;

						var aliasName = this.getAliasName();
						return function (results) {
							var segments = _.map(results, function (segment) {
								return _this5.createSegment({
									value: segment.text,
									expandable: segment.expandable
								});
							});

							// 模板变量
							if (addTemplateVars) {
								var _iteratorNormalCompletion = true;
								var _didIteratorError = false;
								var _iteratorError = undefined;

								try {
									for (var _iterator = _this5.templateSrv.variables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
										var variable = _step.value;

										segments.unshift(_this5.createSegment({
											type: 'template',
											value: '$' + variable.name,
											expandable: true
										}));
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
							}
							// 别名
							if (addAliasName) {
								var self = _this5;
								_.map(aliasName, function (field, as) {
									segments.unshift(self.createSegment({
										type: 'template',
										value: as,
										expandable: true
									}));
								});
							}
							return segments;
						};
					}
				}, {
					key: 'handleQueryError',
					value: function handleQueryError(err) {
						this.error = err.message || 'Failed to issue metric query';
						return [];
					}
				}, {
					key: 'createSegment',
					value: function createSegment(options) {
						return this.uiSegmentSrv.newSegment(options);
					}
				}, {
					key: 'getAliasName',
					value: function getAliasName() {
						var selectmenu = QueryPart.getCategory();
						var aliasName = {};
						_.map(this.select, function (selectParts) {
							var field = undefined;
							var as = undefined;
							_.map(selectParts, function (part) {
								if (part.def.category === selectmenu.Fields.category) {
									field = part.params[0];
								}
								if (part.def.category === selectmenu.AS.category) {
									as = part.params[0];
								}
							});
							if (as) {
								aliasName[as] = field;
							}
						});
						return aliasName;
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
