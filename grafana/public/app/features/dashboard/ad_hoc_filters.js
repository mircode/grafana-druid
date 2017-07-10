/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["lodash","angular","app/core/core_module"],function(a){function b(){return{restrict:"E",template:g,controller:f,bindToController:!0,controllerAs:"ctrl",scope:{variable:"="}}}var c,d,e,f,g;return a("adHocFiltersComponent",b),{setters:[function(a){c=a},function(a){d=a},function(a){e=a}],execute:function(){f=function(){function a(a,b,c,d,e){this.uiSegmentSrv=a,this.datasourceSrv=b,this.$q=c,this.templateSrv=d,this.$rootScope=e,this.removeTagFilterSegment=a.newSegment({fake:!0,value:"-- remove filter --"}),this.buildSegmentModel()}return a.$inject=["uiSegmentSrv","datasourceSrv","$q","templateSrv","$rootScope"],a.prototype.buildSegmentModel=function(){this.segments=[],this.variable.value&&!c["default"].isArray(this.variable.value);for(var a=0,b=this.variable.filters;a<b.length;a++){var d=b[a];this.segments.length>0&&this.segments.push(this.uiSegmentSrv.newCondition("AND")),void 0!==d.key&&void 0!==d.value&&(this.segments.push(this.uiSegmentSrv.newKey(d.key)),this.segments.push(this.uiSegmentSrv.newOperator(d.operator)),this.segments.push(this.uiSegmentSrv.newKeyValue(d.value)))}this.segments.push(this.uiSegmentSrv.newPlusButton())},a.prototype.getOptions=function(a,b){var e=this;return"operator"===a.type?this.$q.when(this.uiSegmentSrv.newOperators(["=","!=","<",">","=~","!~"])):"condition"===a.type?this.$q.when([this.uiSegmentSrv.newSegment("AND")]):this.datasourceSrv.get(this.variable.datasource).then(function(f){var g={},h=null;return"value"!==a.type?h=f.getTagKeys():(g.key=e.segments[b-2].value,h=f.getTagValues(g)),h.then(function(b){return b=c["default"].map(b,function(a){return e.uiSegmentSrv.newSegment({value:a.text})}),"key"===a.type&&b.splice(0,0,d["default"].copy(e.removeTagFilterSegment)),b})})},a.prototype.segmentChanged=function(a,b){this.segments[b]=a,a.value===this.removeTagFilterSegment.value?(this.segments.splice(b,3),0===this.segments.length?this.segments.push(this.uiSegmentSrv.newPlusButton()):this.segments.length>2&&(this.segments.splice(Math.max(b-1,0),1),"plus-button"!==this.segments[this.segments.length-1].type&&this.segments.push(this.uiSegmentSrv.newPlusButton()))):("plus-button"===a.type&&(b>2&&this.segments.splice(b,0,this.uiSegmentSrv.newCondition("AND")),this.segments.push(this.uiSegmentSrv.newOperator("=")),this.segments.push(this.uiSegmentSrv.newFake("select tag value","value","query-segment-value")),a.type="key",a.cssClass="query-segment-key"),b+1===this.segments.length&&this.segments.push(this.uiSegmentSrv.newPlusButton())),this.updateVariableModel()},a.prototype.updateVariableModel=function(){var a=[],b=-1,c=!1;this.segments.forEach(function(d){if("value"===d.type&&d.fake)return void(c=!0);switch(d.type){case"key":a.push({key:d.value}),b+=1;break;case"value":a[b].value=d.value;break;case"operator":a[b].operator=d.value;break;case"condition":a[b].condition=d.value}}),c||(this.variable.setFilters(a),this.$rootScope.$emit("template-variable-value-updated"),this.$rootScope.$broadcast("refresh"))},a}(),a("AdHocFiltersCtrl",f),g='\n<div class="gf-form-inline">\n  <div class="gf-form" ng-repeat="segment in ctrl.segments">\n    <metric-segment segment="segment" get-options="ctrl.getOptions(segment, $index)"\n                    on-change="ctrl.segmentChanged(segment, $index)"></metric-segment>\n  </div>\n</div>\n',e["default"].directive("adHocFilters",b)}}});