import _ from "lodash";
import QueryModel from './query_model';
import QueryBuilder from './query_builder';

export class SQLDatasource {

  constructor(instanceSettings, $q, uiSegmentSrv,backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv=backendSrv;
    this.templateSrv=templateSrv;
    this.uiSegmentSrv=uiSegmentSrv;
  }

  query(options) {
  	var self=this;
  	
    var query = this.buildQueryParameters(options);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }
		

    var allQueries = _.map(query.targets, target => {
    	var model = new QueryModel(target,self.templateSrv,self.uiSegmentSrv, options.scopedVars);
    	return model.render(true);
    }).reduce((acc, current) => {
      if (current !== "") {
        acc += ";" + current;
      }
      return acc;
    });
    
		this.queryBuilder=new QueryBuilder(undefined,this);
    return this.queryBuilder.querySql(allQueries);
  }
	
	
  testDatasource() {
  	return this.request(this.url+'/db/health',undefined,'GET').then(response=>{
			  			console.log(response);
				  		if (response.status === 200) {
				        return { status: "success", message: "Data source is working", title: "Success" };
				      }
  					});
  }
	request(url,param,method){
		return this.backendSrv.datasourceRequest({
				      	url:url,
				      	data:param,
				      	method:method||'POST',
				      	headers:{'Content-Type':'application/json'}
			    });
	}
  annotationQuery(options) {
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
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(options) {
    var target = typeof (options) === "string" ? options : options.target;
    var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
    };
		return this.queryBuilder.queryColumnValue(target);
  }

  buildQueryParameters(options) {
    return options;
  }
}
