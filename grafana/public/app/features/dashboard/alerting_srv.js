/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/core_module"],function(a){var b,c;return{setters:[function(a){b=a}],execute:function(){c=function(){function a(){}return a.prototype.init=function(a,b){this.dashboard=a,this.alerts=b||[]},a}(),a("AlertingSrv",c),b["default"].service("alertingSrv",c)}}});