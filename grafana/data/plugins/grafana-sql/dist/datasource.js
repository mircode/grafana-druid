'use strict';

System.register(['lodash', './query_model', './query_builder'], function (_export, _context) {
  "use strict";

  var _, QueryModel, QueryBuilder, _createClass, SQLDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_query_model) {
      QueryModel = _query_model.default;
    }, function (_query_builder) {
      QueryBuilder = _query_builder.default;
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

      _export('SQLDatasource', SQLDatasource = function () {
        function SQLDatasource(instanceSettings, $q, uiSegmentSrv, backendSrv, templateSrv) {
          _classCallCheck(this, SQLDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
          this.uiSegmentSrv = uiSegmentSrv;
        }

        _createClass(SQLDatasource, [{
          key: 'query',
          value: function query(options) {
            var self = this;

            var query = this.buildQueryParameters(options);
            query.targets = query.targets.filter(function (t) {
              return !t.hide;
            });

            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
            }

            var allQueries = _.map(query.targets, function (target) {
              var model = new QueryModel(target, self.templateSrv, self.uiSegmentSrv, options.scopedVars);
              return model.render(true);
            }).reduce(function (acc, current) {
              if (current !== "") {
                acc += ";" + current;
              }
              return acc;
            });

            this.queryBuilder = new QueryBuilder(undefined, this);
            return this.queryBuilder.querySql(allQueries);
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.request(this.url + '/db/health', undefined, 'GET').then(function (response) {
              console.log(response);
              if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: 'request',
          value: function request(url, param, method) {
            return this.backendSrv.datasourceRequest({
              url: url,
              data: param,
              method: method || 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
            var annotationQuery = {
              range: options.range,
              annotation: {
                name: options.annotation.name,
                datasource: options.annotation.datasource,
                enable: options.annotation.enable,
                iconColor: options.annotation.iconColor,
                query: query
              },
              rangeRaw: options.rangeRaw
            };

            return this.backendSrv.datasourceRequest({
              url: this.url + '/annotations',
              method: 'POST',
              data: annotationQuery
            }).then(function (result) {
              return result.data;
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(options) {
            var target = typeof options === "string" ? options : options.target;
            var interpolated = {
              target: this.templateSrv.replace(target, null, 'regex')
            };
            return this.queryBuilder.queryColumnValue(target);
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            return options;
          }
        }]);

        return SQLDatasource;
      }());

      _export('SQLDatasource', SQLDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
