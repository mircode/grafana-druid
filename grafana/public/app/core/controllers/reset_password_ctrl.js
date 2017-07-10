/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

define(["angular","../core_module"],function(a,b){"use strict";b["default"].controller("ResetPasswordCtrl",["$scope","contextSrv","backendSrv","$location",function(a,b,c,d){b.sidemenu=!1,a.formModel={},a.mode="send";var e=d.search();e.code&&(a.mode="reset",a.formModel.code=e.code),a.sendResetEmail=function(){a.sendResetForm.$valid&&c.post("/api/user/password/send-reset-email",a.formModel).then(function(){a.mode="email-sent"})},a.submitReset=function(){if(a.resetForm.$valid)return a.formModel.newPassword!==a.formModel.confirmPassword?void a.appEvent("alert-warning",["New passwords do not match",""]):void c.post("/api/user/password/reset",a.formModel).then(function(){d.path("login")})}}])});