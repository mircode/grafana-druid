/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/core"],function(a){var b,c,d;return{setters:[function(a){b=a}],execute:function(){c=function(){function a(a){this.target=a}return a.prototype.subscribe=function(a){var c=b.liveSrv.subscribe(this.target.stream);return c.subscribe(function(a){console.log("grafana stream ds data!",a)})},a}(),d=function(){function a(){}return a.prototype.query=function(a){if(0===a.targets.length)return Promise.resolve({data:[]});var b=a.targets[0],d=new c(b);return Promise.resolve(d)},a}(),a("GrafanaStreamDS",d)}}});