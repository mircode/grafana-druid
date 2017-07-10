import {SQLDatasource} from './datasource';
import {SQLQueryCtrl} from './query_ctrl';

// 链接配置
class SQLConfigCtrl {}
SQLConfigCtrl.templateUrl = 'partials/config.html';

// 查询说明
class SQLQueryOptionsCtrl {}
SQLQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

// 标注查询
class SQLAnnotationsQueryCtrl {}
SQLAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

// 导出模块
export {
  SQLDatasource as Datasource,
  SQLQueryCtrl as QueryCtrl,
  SQLConfigCtrl as ConfigCtrl,
  SQLQueryOptionsCtrl as QueryOptionsCtrl,
  SQLAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
