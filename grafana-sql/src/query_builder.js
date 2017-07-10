
import _ from 'lodash';

// 用于发起后台请求
export class QueryBuilder{
	
	// 构造函数
	constructor(target,database){
		this.target = target;
    this.database = database;
	}
	build(){
    return this.target.rawQuery ? this._modifyRawQuery() : this._buildQuery();
  };
  
	 // 渲染查询条件
  renderTagCondition (tag, index) {
    var str = "";
    var operator = tag.operator;
    var value = tag.value;
    if (index > 0) {
      str = (tag.condition || 'AND') + ' ';
    }

    if (!operator) {
      if (/^\/.*\/$/.test(tag.value)) {
        operator = '=~';
      } else {
        operator = '=';
      }
    }

    // quote value unless regex or number
    if (operator !== '=~' && operator !== '!~' && isNaN(+value)) {
      value = "'" + value + "'";
    }

    return str + '"' + tag.key + '" ' + operator + ' ' + value;
  }

	// 查询表格信息
  queryTables(){
  	
  }
  // 查询取列信息
  queryColumns(){
  	
  }
  // 查询SQL
  querySql(){
  	
  }
  

  

  buildExploreQuery(type, withKey, withMeasurementFilter) {
    var query;
    var measurement;

    if (type === 'TAG_KEYS') {
      query = 'SHOW TAG KEYS';
      measurement = this.target.measurement;
    } else if (type === 'TAG_VALUES') {
      query = 'SHOW TAG VALUES';
      measurement = this.target.measurement;
    } else if (type === 'MEASUREMENTS') {
      query = 'SHOW MEASUREMENTS';
      if (withMeasurementFilter)
      {
        query += ' WITH MEASUREMENT =~ /' + withMeasurementFilter +'/';
      }
    } else if (type === 'FIELDS') {
      query = 'SHOW FIELD KEYS FROM "' + this.target.measurement + '"';
      return query;
    } else if (type === 'RETENTION POLICIES') {
      query = 'SHOW RETENTION POLICIES on "' + this.database + '"';
      return query;
    }

    if (measurement) {
      if (!measurement.match('^/.*/') && !measurement.match(/^merge\(.*\)/)) {
        measurement = '"' + measurement+ '"';
      }
      query += ' FROM ' + measurement;
    }

    if (withKey) {
      query += ' WITH KEY = "' + withKey + '"';
    }

    if (this.target.tags && this.target.tags.length > 0) {
      var whereConditions = _.reduce(this.target.tags, function(memo, tag) {
        // do not add a condition for the key we want to explore for
        if (tag.key === withKey) {
          return memo;
        }
        memo.push(renderTagCondition(tag, memo.length));
        return memo;
      }, []);

      if (whereConditions.length > 0) {
        query +=  ' WHERE ' + whereConditions.join(' ');
      }
    }

    return query;
  };
}
	
