/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/core_module"],function(a){function b(){return{restrict:"E",controller:e,bindToController:!0,controllerAs:"ctrl",template:d,scope:{model:"="}}}var c,d,e;return a("dashboardSelector",b),{setters:[function(a){c=a}],execute:function(){d='\n<select class="gf-form-input" ng-model="ctrl.model" ng-options="f.value as f.text for f in ctrl.options"></select>\n<info-popover mode="right-absolute">\n  Not finding dashboard you want? Star it first, then it should appear in this select box.\n</info-popover>\n',e=function(){function a(a){this.backendSrv=a}return a.$inject=["backendSrv"],a.prototype.$onInit=function(){var a=this;return this.options=[{value:0,text:"Default"}],this.backendSrv.search({starred:!0}).then(function(b){b.forEach(function(b){a.options.push({value:b.id,text:b.title})})})},a}(),a("DashboardSelectorCtrl",e),c["default"].directive("dashboardSelector",b)}}});