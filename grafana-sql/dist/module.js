'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var SQLDatasource, SQLQueryCtrl, SQLConfigCtrl, SQLQueryOptionsCtrl, SQLAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      SQLDatasource = _datasource.SQLDatasource;
    }, function (_query_ctrl) {
      SQLQueryCtrl = _query_ctrl.SQLQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', SQLConfigCtrl = function SQLConfigCtrl() {
        _classCallCheck(this, SQLConfigCtrl);
      });

      SQLConfigCtrl.templateUrl = 'partials/config.html';

      // 查询说明

      _export('QueryOptionsCtrl', SQLQueryOptionsCtrl = function SQLQueryOptionsCtrl() {
        _classCallCheck(this, SQLQueryOptionsCtrl);
      });

      SQLQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      // 标注查询

      _export('AnnotationsQueryCtrl', SQLAnnotationsQueryCtrl = function SQLAnnotationsQueryCtrl() {
        _classCallCheck(this, SQLAnnotationsQueryCtrl);
      });

      SQLAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      // 导出模块

      _export('Datasource', SQLDatasource);

      _export('QueryCtrl', SQLQueryCtrl);

      _export('ConfigCtrl', SQLConfigCtrl);

      _export('QueryOptionsCtrl', SQLQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', SQLAnnotationsQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
