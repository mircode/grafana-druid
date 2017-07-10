/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["./adminListUsersCtrl","./adminListOrgsCtrl","./adminEditOrgCtrl","./adminEditUserCtrl","app/core/core_module"],function(a){var b,c,d,e;return{setters:[function(a){},function(a){},function(a){},function(a){},function(a){b=a}],execute:function(){c=function(){function a(a,b){b.get("/api/admin/settings").then(function(b){a.settings=b})}return a.$inject=["$scope","backendSrv"],a}(),d=function(){function a(){}return a}(),e=function(){function a(a){var b=this;a.get("/api/admin/stats").then(function(a){b.stats=a})}return a.$inject=["backendSrv"],a}(),a("AdminStatsCtrl",e),b["default"].controller("AdminSettingsCtrl",c),b["default"].controller("AdminHomeCtrl",d),b["default"].controller("AdminStatsCtrl",e)}}});