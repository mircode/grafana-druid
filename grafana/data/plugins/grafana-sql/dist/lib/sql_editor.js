'use strict';

System.register(['angular', './editor.css!', './editor.js'], function (_export, _context) {
	"use strict";

	var angular, CodeMirror, SqlFormater, _createClass, SQLEditor;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_angular) {
			angular = _angular.default;
		}, function (_editorCss) {}, function (_editorJs) {
			CodeMirror = _editorJs.CodeMirror;
			SqlFormater = _editorJs.SqlFormater;
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

			SQLEditor = function () {
				function SQLEditor() {
					_classCallCheck(this, SQLEditor);

					var module = angular.module('grafana.directives');
					module.directive('sqlCodemirror', this.directive);
				}

				_createClass(SQLEditor, [{
					key: 'directive',
					value: function directive() {

						return {
							restrict: 'EA',
							require: '?ngModel',
							compile: function compile() {
								return link;
							}
						};

						function link(scope, iElement, iAttrs, ngModel) {
							var def = {
								lineNumbers: true,
								mode: 'text/x-sql',
								theme: 'blackboard',
								width: '100%',
								styleActiveLine: true,
								matchBrackets: true
							};
							var options = angular.extend({ value: iElement.text() }, scope.$eval(iAttrs.sqlCodemirror), scope.$eval(iAttrs.sqlCodemirrorOpts) || def);

							var editor = CodeMirror.fromTextArea(iElement[0], options);
							editor.on('change', function (instance) {
								var newValue = instance.getValue();
								if (newValue !== ngModel.$viewValue) {
									scope.$evalAsync(function () {
										ngModel.$setViewValue(newValue);
									});
								}
							});

							if (!ngModel) {
								return;
							}

							ngModel.$formatters.push(function (value) {
								if (angular.isUndefined(value) || value === null) {
									return '';
								} else if (angular.isObject(value) || angular.isArray(value)) {
									throw new Error('sql-codemirror cannot use an object or an array as a model');
								}
								return value;
							});

							ngModel.$render = function () {
								var sql = ngModel.$viewValue || '';
								var res = SqlFormater.format(sql.replace(';', ''), {});
								if (typeof res === "string") sql = res;
								editor.setValue(sql);
							};
						}
					}
				}, {
					key: 'format',
					value: function format(sql) {
						try {
							return SqlFormater.format(sql.replace(';', ''), {});
						} catch (err) {
							return sql;
						}
					}
				}]);

				return SQLEditor;
			}();

			_export('default', SQLEditor);
		}
	};
});
//# sourceMappingURL=sql_editor.js.map
