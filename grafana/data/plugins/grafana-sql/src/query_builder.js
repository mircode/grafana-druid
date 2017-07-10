import _ from 'lodash';


// 用于发起后台请求
export default class QueryBuilder {

	// 构造函数
	constructor(target, database) {
		this.target = target;
		this.database = database;
		this.url=database.url;
	}
	request(url,param,cache){
		var self=this;
		var cache=cache||true;
		var method='POST';
		if(!cache) return self.database.request(url,param,method);
		
		var cachekey=self.hashCode(url+JSON.stringify(param)+method);
		if(sessionStorage.getItem(cachekey)){
			return new Promise(function(resolve,reject){
				resolve(JSON.parse(sessionStorage.getItem(cachekey)));
			});
		}else{
			return self.database.request(url,param,method).then(function(data){
				sessionStorage.setItem(cachekey,JSON.stringify(data));
				return data;
			});
		}
	}
	hashCode(str){
	    var hash = 0;
	    if (str.length == 0) return hash;
	    for (var i = 0; i < str.length; i++) {
	        var ch = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+ch;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}
	// 查询表格信息
	queryTables() {
		var self=this;
		return self.request(this.url+'/db/query',{sql:'show tables'}).then(function(data){
		    return _.map(data.data, table=>{
		    	if(_.isObject(table)){
					return _.mapKeys(table,(value, key)=>{
					  return 'text';
					});			    	
				}else{
					return {'text':table}
				}
			});
		});

	}
	// 查询取列信息
	queryColumns() {
		var self=this;
		return self.request(this.url+'/db/query',{sql:'desc '+this.target.table}).then(function(data){
		    return _.map(data.data, column=>{
		    	var text=column['Field'];
		    	var type=column['Type'];
		    	if(type.indexOf('varchar')>-11||type.indexOf('string')>-1){
		    		type='string';
		    	}
		    	return {text:text,type:type};
		    	
			});
		});
	}
	// 获取某列的所有值
	queryColumnValue(sql){
		var self=this;
		return self.request(this.url+'/db/query',{sql:sql}).then(function(data){
		    var res= _.map(data.data, column=>{
		    	var text=undefined;
		    	var value=undefined;
		    	for(var key in column){
		    		text=key;
		    		value=column[key];
		    	}
		    	return {text:value,value:value};
			});
			return res;
		});
	}
	// 查询SQL
	querySql(sql) {
		var self=this;
		var sqls=sql.split(';');
		var promis=[];
		for(var i in sqls){
			promis.push(self.request(this.url+'/db/query',{sql:sqls[i]}));
		}
		
		return self.database.q.all(promis).then(function(data){
		    var index={};
		    if(_.isArray(data)){
		    	for(var i in data){
		    		_.map(data[i].data,row=>{
		    				var x=row.x;
		    				var y=row.y;
		    				var legend=row.legend;
		    				
		    				var year=undefined;
		    				var month=undefined;
		    				var day=undefined;
		    				x.replace(/(\d{1,4})(\d{1,2})(\d{1,2})/ig,function(match,yr,m,d){
		    					year=yr;
		    					month=m;
		    					day=d;
		    				});
		    				if(!index[legend]){
		    					index[legend]={target:legend,datapoints:[]};
		    				}
		    				var time=(new Date(year,month-1,day)).getTime();
		    				index[legend].datapoints.push([y,time]);
		    		});
	    		}
    		}
    		var res=[];
    		for(var key in index){
    			res.push(index[key]);
    		}
    		return {data:res};
		});
	}

}