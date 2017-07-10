/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

define(["lodash","jquery"],function(a,b){"use strict";function c(a){a.params=a.params||[],a.defaultParams=a.defaultParams||[],a.category&&a.category.push(a),e[a.name]=a,e[a.shortName||a.name]=a}function d(a,b){this.def=a,this.params=[],b&&b.withDefaultParams&&(this.params=a.defaultParams.slice(0)),this.updateText()}var e=[],f={Combine:[],Transform:[],Calculate:[],Filter:[],Special:[]},g=[{name:"other",type:"value_or_series",optional:!0},{name:"other",type:"value_or_series",optional:!0},{name:"other",type:"value_or_series",optional:!0},{name:"other",type:"value_or_series",optional:!0},{name:"other",type:"value_or_series",optional:!0}];return c({name:"scaleToSeconds",category:f.Transform,params:[{name:"seconds",type:"int"}],defaultParams:[1]}),c({name:"perSecond",category:f.Transform,params:[{name:"max value",type:"int",optional:!0}],defaultParams:[]}),c({name:"holtWintersForecast",category:f.Calculate}),c({name:"holtWintersConfidenceBands",category:f.Calculate,params:[{name:"delta",type:"int"}],defaultParams:[3]}),c({name:"holtWintersAberration",category:f.Calculate,params:[{name:"delta",type:"int"}],defaultParams:[3]}),c({name:"nPercentile",category:f.Calculate,params:[{name:"Nth percentile",type:"int"}],defaultParams:[95]}),c({name:"diffSeries",params:g,defaultParams:["#A"],category:f.Calculate}),c({name:"stddevSeries",params:g,defaultParams:[""],category:f.Calculate}),c({name:"divideSeries",params:g,defaultParams:["#A"],category:f.Calculate}),c({name:"multiplySeries",params:g,defaultParams:["#A"],category:f.Calculate}),c({name:"asPercent",params:g,defaultParams:["#A"],category:f.Calculate}),c({name:"group",params:g,defaultParams:["#A","#B"],category:f.Combine}),c({name:"mapSeries",shortName:"map",params:[{name:"node",type:"int"}],defaultParams:[3],category:f.Combine}),c({name:"reduceSeries",shortName:"reduce",params:[{name:"function",type:"string",options:["asPercent","diffSeries","divideSeries"]},{name:"reduceNode",type:"int",options:[0,1,2,3,4,5,6,7,8,9,10,11,12,13]},{name:"reduceMatchers",type:"string"},{name:"reduceMatchers",type:"string"}],defaultParams:["asPercent",2,"used_bytes","total_bytes"],category:f.Combine}),c({name:"sumSeries",shortName:"sum",category:f.Combine,params:g,defaultParams:[""]}),c({name:"averageSeries",shortName:"avg",category:f.Combine,params:g,defaultParams:[""]}),c({name:"isNonNull",category:f.Combine}),c({name:"rangeOfSeries",category:f.Combine}),c({name:"percentileOfSeries",category:f.Combine,params:[{name:"n",type:"int"},{name:"interpolate",type:"select",options:["true","false"]}],defaultParams:[95,"false"]}),c({name:"sumSeriesWithWildcards",category:f.Combine,params:[{name:"node",type:"int"},{name:"node",type:"int",optional:!0},{name:"node",type:"int",optional:!0},{name:"node",type:"int",optional:!0}],defaultParams:[3]}),c({name:"maxSeries",shortName:"max",category:f.Combine}),c({name:"minSeries",shortName:"min",category:f.Combine}),c({name:"averageSeriesWithWildcards",category:f.Combine,params:[{name:"node",type:"int"},{name:"node",type:"int",optional:!0}],defaultParams:[3]}),c({name:"alias",category:f.Special,params:[{name:"alias",type:"string"}],defaultParams:["alias"]}),c({name:"aliasSub",category:f.Special,params:[{name:"search",type:"string"},{name:"replace",type:"string"}],defaultParams:["","\\1"]}),c({name:"stacked",category:f.Special,params:[{name:"stack",type:"string"}],defaultParams:["stacked"]}),c({name:"consolidateBy",category:f.Special,params:[{name:"function",type:"string",options:["sum","average","min","max"]}],defaultParams:["max"]}),c({name:"cumulative",category:f.Special,params:[],defaultParams:[]}),c({name:"groupByNode",category:f.Special,params:[{name:"node",type:"int",options:[0,1,2,3,4,5,6,7,8,9,10,12]},{name:"function",type:"string",options:["sum","avg","maxSeries"]}],defaultParams:[3,"sum"]}),c({name:"groupByNodes",category:f.Special,params:[{name:"function",type:"string",options:["sum","avg","maxSeries"]},{name:"node",type:"int",options:[0,1,2,3,4,5,6,7,8,9,10,12]},{name:"node",type:"int",options:[0,-1,-2,-3,-4,-5,-6,-7],optional:!0},{name:"node",type:"int",options:[0,-1,-2,-3,-4,-5,-6,-7],optional:!0},{name:"node",type:"int",options:[0,-1,-2,-3,-4,-5,-6,-7],optional:!0}],defaultParams:["sum",3]}),c({name:"aliasByNode",category:f.Special,params:[{name:"node",type:"int",options:[0,1,2,3,4,5,6,7,8,9,10,12]},{name:"node",type:"int",options:[0,-1,-2,-3,-4,-5,-6,-7],optional:!0},{name:"node",type:"int",options:[0,-1,-2,-3,-4,-5,-6,-7],optional:!0},{name:"node",type:"int",options:[0,-1,-2,-3,-4,-5,-6,-7],optional:!0}],defaultParams:[3]}),c({name:"substr",category:f.Special,params:[{name:"start",type:"int",options:[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,12]},{name:"stop",type:"int",options:[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,12]}],defaultParams:[0,0]}),c({name:"sortByName",category:f.Special,params:[{name:"natural",type:"select",options:["true","false"],optional:!0}],defaultParams:["false"]}),c({name:"sortByMaxima",category:f.Special}),c({name:"sortByMinima",category:f.Special}),c({name:"sortByTotal",category:f.Special}),c({name:"aliasByMetric",category:f.Special}),c({name:"randomWalk",fake:!0,category:f.Special,params:[{name:"name",type:"string"}],defaultParams:["randomWalk"]}),c({name:"countSeries",category:f.Special}),c({name:"constantLine",category:f.Special,params:[{name:"value",type:"int"}],defaultParams:[10]}),c({name:"cactiStyle",category:f.Special}),c({name:"keepLastValue",category:f.Special,params:[{name:"n",type:"int"}],defaultParams:[100]}),c({name:"changed",category:f.Special,params:[],defaultParams:[]}),c({name:"scale",category:f.Transform,params:[{name:"factor",type:"int"}],defaultParams:[1]}),c({name:"offset",category:f.Transform,params:[{name:"amount",type:"int"}],defaultParams:[10]}),c({name:"offsetToZero",category:f.Transform}),c({name:"transformNull",category:f.Transform,params:[{name:"amount",type:"int"}],defaultParams:[0]}),c({name:"integral",category:f.Transform}),c({name:"derivative",category:f.Transform}),c({name:"nonNegativeDerivative",category:f.Transform,params:[{name:"max value or 0",type:"int",optional:!0}],defaultParams:[""]}),c({name:"timeShift",category:f.Transform,params:[{name:"amount",type:"select",options:["1h","6h","12h","1d","2d","7d","14d","30d"]}],defaultParams:["1d"]}),c({name:"timeStack",category:f.Transform,params:[{name:"timeShiftUnit",type:"select",options:["1h","6h","12h","1d","2d","7d","14d","30d"]},{name:"timeShiftStart",type:"int"},{name:"timeShiftEnd",type:"int"}],defaultParams:["1d",0,7]}),c({name:"summarize",category:f.Transform,params:[{name:"interval",type:"string"},{name:"func",type:"select",options:["sum","avg","min","max","last"]},{name:"alignToFrom",type:"boolean",optional:!0,options:["false","true"]}],defaultParams:["1h","sum","false"]}),c({name:"smartSummarize",category:f.Transform,params:[{name:"interval",type:"string"},{name:"func",type:"select",options:["sum","avg","min","max","last"]}],defaultParams:["1h","sum"]}),c({name:"absolute",category:f.Transform}),c({name:"hitcount",category:f.Transform,params:[{name:"interval",type:"string"}],defaultParams:["10s"]}),c({name:"log",category:f.Transform,params:[{name:"base",type:"int"}],defaultParams:["10"]}),c({name:"averageAbove",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[25]}),c({name:"averageBelow",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[25]}),c({name:"currentAbove",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[25]}),c({name:"currentBelow",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[25]}),c({name:"maximumAbove",category:f.Filter,params:[{name:"value",type:"int"}],defaultParams:[0]}),c({name:"maximumBelow",category:f.Filter,params:[{name:"value",type:"int"}],defaultParams:[0]}),c({name:"minimumAbove",category:f.Filter,params:[{name:"value",type:"int"}],defaultParams:[0]}),c({name:"minimumBelow",category:f.Filter,params:[{name:"value",type:"int"}],defaultParams:[0]}),c({name:"limit",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[5]}),c({name:"mostDeviant",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[10]}),c({name:"exclude",category:f.Filter,params:[{name:"exclude",type:"string"}],defaultParams:["exclude"]}),c({name:"grep",category:f.Filter,params:[{name:"grep",type:"string"}],defaultParams:["grep"]}),c({name:"highestCurrent",category:f.Filter,params:[{name:"count",type:"int"}],defaultParams:[5]}),c({name:"highestMax",category:f.Filter,params:[{name:"count",type:"int"}],defaultParams:[5]}),c({name:"lowestCurrent",category:f.Filter,params:[{name:"count",type:"int"}],defaultParams:[5]}),c({name:"movingAverage",category:f.Filter,params:[{name:"windowSize",type:"int_or_interval",options:["5","7","10","5min","10min","30min","1hour"]}],defaultParams:[10]}),c({name:"weightedAverage",category:f.Filter,params:[{name:"other",type:"value_or_series",optional:!0},{name:"node",type:"int",options:[0,1,2,3,4,5,6,7,8,9,10,12]}],defaultParams:["#A",4]}),c({name:"movingMedian",category:f.Filter,params:[{name:"windowSize",type:"int_or_interval",options:["5","7","10","5min","10min","30min","1hour"]}],defaultParams:["5"]}),c({name:"stdev",category:f.Filter,params:[{name:"n",type:"int"},{name:"tolerance",type:"int"}],defaultParams:[5,.1]}),c({name:"highestAverage",category:f.Filter,params:[{name:"count",type:"int"}],defaultParams:[5]}),c({name:"lowestAverage",category:f.Filter,params:[{name:"count",type:"int"}],defaultParams:[5]}),c({name:"removeAbovePercentile",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[5]}),c({name:"removeAboveValue",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[5]}),c({name:"removeBelowPercentile",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[5]}),c({name:"removeBelowValue",category:f.Filter,params:[{name:"n",type:"int"}],defaultParams:[5]}),c({name:"removeEmptySeries",category:f.Filter}),c({name:"useSeriesAbove",category:f.Filter,params:[{name:"value",type:"int"},{name:"search",type:"string"},{name:"replace",type:"string"}],defaultParams:[0,"search","replace"]}),a.each(f,function(b,c){f[c]=a.sortBy(b,"name")}),d.prototype.render=function(c){var d=this.def.name+"(",e=a.map(this.params,function(a,c){var d=this.def.params[c].type;return"int"===d||"value_or_series"===d||"boolean"===d?a:"int_or_interval"===d&&b.isNumeric(a)?a:"'"+a+"'"}.bind(this));return c&&e.unshift(c),d+e.join(", ")+")"},d.prototype._hasMultipleParamsInString=function(a,b){return a.indexOf(",")!==-1&&(this.def.params[b+1]&&this.def.params[b+1].optional)},d.prototype.updateParam=function(b,c){return this._hasMultipleParamsInString(b,c)?void a.each(b.split(","),function(a,b){this.updateParam(a.trim(),b)}.bind(this)):(""===b&&this.def.params[c].optional?this.params.splice(c,1):this.params[c]=b,void this.updateText())},d.prototype.updateText=function(){if(0===this.params.length)return void(this.text=this.def.name+"()");var a=this.def.name+"(";a+=this.params.join(", "),a+=")",this.text=a},{createFuncInstance:function(b,c){if(a.isString(b)){if(!e[b])throw{message:"Method not found "+name};b=e[b]}return new d(b,c)},getFuncDef:function(a){return e[a]},getCategories:function(){return f}}});