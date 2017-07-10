/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

define(["angular","lodash","app/core/utils/datemath","moment"],function(a,b,c){"use strict";function d(d,e,f,g){function h(a,c,d,e,f){var g=i(a,d,c,e),h=[];return b.each(a.dps,function(a,b){2===f?h.push([a,1*b]):h.push([a,1e3*b])}),{target:g,datapoints:h}}function i(a,c,d,e){if(c.alias){var f=b.clone(e.scopedVars||{});return b.each(a.tags,function(a,b){f["tag_"+b]={value:a}}),g.replace(c.alias,f)}var h=a.metric,i=[];return b.isEmpty(a.tags)||b.each(b.toPairs(a.tags),function(a){b.has(d,a[0])&&i.push(a[0]+"="+a[1])}),b.isEmpty(i)||(h+="{"+i.join(", ")+"}"),h}function j(b,c){if(!b.metric||b.hide)return null;var d={metric:g.replace(b.metric,c.scopedVars),aggregator:"avg"};if(b.aggregator&&(d.aggregator=g.replace(b.aggregator)),b.shouldComputeRate&&(d.rate=!0,d.rateOptions={counter:!!b.isCounter},b.counterMax&&b.counterMax.length&&(d.rateOptions.counterMax=parseInt(b.counterMax)),b.counterResetValue&&b.counterResetValue.length&&(d.rateOptions.resetValue=parseInt(b.counterResetValue))),!b.disableDownsampling){var e=g.replace(b.downsampleInterval||c.interval);e.match(/\.[0-9]+s/)&&(e=1e3*parseFloat(e)+"ms"),d.downsample=e+"-"+b.downsampleAggregator,b.downsampleFillPolicy&&"none"!==b.downsampleFillPolicy&&(d.downsample+="-"+b.downsampleFillPolicy)}if(b.filters&&b.filters.length>0){if(d.filters=a.copy(b.filters),d.filters)for(var f in d.filters)d.filters[f].filter=g.replace(d.filters[f].filter,c.scopedVars,"pipe")}else if(d.tags=a.copy(b.tags),d.tags)for(var h in d.tags)d.tags[h]=g.replace(d.tags[h],c.scopedVars,"pipe");return b.explicitTags&&(d.explicitTags=!0),d}function k(a,c,d){var e;return b.map(a,function(a){return 3===d?a.query.index:b.findIndex(c.targets,function(d){return d.filters&&d.filters.length>0?d.metric===a.metric:d.metric===a.metric&&b.every(d.tags,function(b,d){return e=g.replace(b,c.scopedVars,"pipe"),a.tags[d]===e||"*"===e})})})}function l(a,b){return"now"===a?null:(a=c.parse(a,b),a.valueOf())}this.type="opentsdb",this.url=d.url,this.name=d.name,this.withCredentials=d.withCredentials,this.basicAuth=d.basicAuth,d.jsonData=d.jsonData||{},this.tsdbVersion=d.jsonData.tsdbVersion||1,this.tsdbResolution=d.jsonData.tsdbResolution||1,this.supportMetrics=!0,this.tagKeys={},this.query=function(a){var c=l(a.rangeRaw.from,!1),d=l(a.rangeRaw.to,!0),f=[];b.each(a.targets,function(b){b.metric&&f.push(j(b,a))});var g=b.compact(f);if(b.isEmpty(g)){var i=e.defer();return i.resolve({data:[]}),i.promise}var m={};return b.each(g,function(a){a.filters&&a.filters.length>0?b.each(a.filters,function(a){m[a.tagk]=!0}):b.each(a.tags,function(a,b){m[b]=!0})}),this.performTimeSeriesQuery(g,c,d).then(function(c){var d=k(c.data,a,this.tsdbVersion),e=b.map(c.data,function(b,c){return c=d[c],c===-1&&(c=0),this._saveTagKeys(b),h(b,m,a.targets[c],a,this.tsdbResolution)}.bind(this));return{data:e}}.bind(this))},this.annotationQuery=function(a){var c=l(a.rangeRaw.from,!1),d=l(a.rangeRaw.to,!0),e=[],f=[];e.push({aggregator:"sum",metric:a.annotation.target});var g=b.compact(e);return this.performTimeSeriesQuery(g,c,d).then(function(c){if(c.data[0]){var d=c.data[0].annotations;a.annotation.isGlobal&&(d=c.data[0].globalAnnotations),d&&b.each(d,function(b){var c={title:b.description,time:1e3*Math.floor(b.startTime),text:b.notes,annotation:a.annotation};f.push(c)})}return f}.bind(this))},this.targetContainsTemplate=function(a){if(a.filters&&a.filters.length>0)for(var b=0;b<a.filters.length;b++)if(g.variableExists(a.filters[b].filter))return!0;if(a.tags&&Object.keys(a.tags).length>0)for(var c in a.tags)if(g.variableExists(a.tags[c]))return!0;return!1},this.performTimeSeriesQuery=function(a,b,c){var d=!1;2===this.tsdbResolution&&(d=!0);var e={start:b,queries:a,msResolution:d,globalAnnotations:!0};3===this.tsdbVersion&&(e.showQuery=!0),c&&(e.end=c);var g={method:"POST",url:this.url+"/api/query",data:e};return this._addCredentialOptions(g),f.datasourceRequest(g)},this.suggestTagKeys=function(a){return e.when(this.tagKeys[a]||[])},this._saveTagKeys=function(a){var c=Object.keys(a.tags);b.each(a.aggregateTags,function(a){c.push(a)}),this.tagKeys[a.metric]=c},this._performSuggestQuery=function(a,b){return this._get("/api/suggest",{type:b,q:a,max:1e3}).then(function(a){return a.data})},this._performMetricKeyValueLookup=function(a,c){if(!a||!c)return e.when([]);var d=c.split(",").map(function(a){return a.trim()}),f=d[0],g=f+"=*";d.length>1&&(g+=","+d.splice(1).join(","));var h=a+"{"+g+"}";return this._get("/api/search/lookup",{m:h,limit:3e3}).then(function(a){a=a.data.results;var c=[];return b.each(a,function(a){c.indexOf(a.tags[f])===-1&&c.push(a.tags[f])}),c})},this._performMetricKeyLookup=function(a){return a?this._get("/api/search/lookup",{m:a,limit:1e3}).then(function(a){a=a.data.results;var c=[];return b.each(a,function(a){b.each(a.tags,function(a,b){c.indexOf(b)===-1&&c.push(b)})}),c}):e.when([])},this._get=function(a,b){var c={method:"GET",url:this.url+a,params:b};return this._addCredentialOptions(c),f.datasourceRequest(c)},this._addCredentialOptions=function(a){(this.basicAuth||this.withCredentials)&&(a.withCredentials=!0),this.basicAuth&&(a.headers={Authorization:this.basicAuth})},this.metricFindQuery=function(a){if(!a)return e.when([]);var c;try{c=g.replace(a,{},"distributed")}catch(d){return e.reject(d)}var f=function(a){return b.map(a,function(a){return{text:a}})},h=/metrics\((.*)\)/,i=/tag_names\((.*)\)/,j=/tag_values\((.*?),\s?(.*)\)/,k=/suggest_tagk\((.*)\)/,l=/suggest_tagv\((.*)\)/,m=c.match(h);if(m)return this._performSuggestQuery(m[1],"metrics").then(f);var n=c.match(i);if(n)return this._performMetricKeyLookup(n[1]).then(f);var o=c.match(j);if(o)return this._performMetricKeyValueLookup(o[1],o[2]).then(f);var p=c.match(k);if(p)return this._performSuggestQuery(p[1],"tagk").then(f);var q=c.match(l);return q?this._performSuggestQuery(q[1],"tagv").then(f):e.when([])},this.testDatasource=function(){return this._performSuggestQuery("cpu","metrics").then(function(){return{status:"success",message:"Data source is working",title:"Success"}})};var m=null;this.getAggregators=function(){return m?m:m=this._get("/api/aggregators").then(function(a){return a.data&&b.isArray(a.data)?a.data.sort():[]})};var n=null;this.getFilterTypes=function(){return n?n:n=this._get("/api/config/filters").then(function(a){return a.data?Object.keys(a.data).sort():[]})}}return d.$inject=["instanceSettings","$q","backendSrv","templateSrv"],{OpenTsDatasource:d}});