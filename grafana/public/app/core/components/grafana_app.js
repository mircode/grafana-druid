/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/config","lodash","jquery","app/core/core_module","app/core/profiler","app/core/app_events"],function(a){function b(a,b){return{restrict:"E",controller:i,link:function(c,d){function f(){m&&j.hasClass("page-dashboard")&&(new Date).getTime()-l>n&&(m=!1,j.addClass("user-activity-low"))}function g(){l=(new Date).getTime(),m||(m=!0,j.removeClass("user-activity-low"))}var i,j=e["default"]("body");c.$watch("contextSrv.sidemenu",function(a){void 0!==a&&(j.toggleClass("sidemenu-open",c.contextSrv.sidemenu),a||b.setPinnedState(!1)),b.sidemenu&&(i=!0,setTimeout(function(){i=!1},300))}),c.$watch("contextSrv.pinned",function(a){void 0!==a&&j.toggleClass("sidemenu-pinned",a)});var k;c.$on("$routeChangeSuccess",function(a,b){k&&j.removeClass(k),k=b.$$route.pageClass,k&&j.addClass(k),e["default"]("#tooltip, .tooltip").remove(),b.params.kiosk&&h["default"].emit("toggle-kiosk-mode")}),h["default"].on("toggle-kiosk-mode",function(){j.toggleClass("page-kiosk-mode")});var l=(new Date).getTime(),m=!0,n=6e4;j.mousemove(g),j.keydown(g),document.addEventListener("visibilitychange",g),setInterval(f,2e3),h["default"].on("toggle-view-mode",function(){l=0,f()}),j.click(function(f){var g=e["default"](f.target);if(0!==g.parents().length){var h=g.closest("[data-click-hide]");if(h.length){var k=h.parent();h.detach(),setTimeout(function(){k.append(h)},100)}0===g.parents(".dash-playlist-actions").length&&a.stop(),j.find(".search-container").length>0&&0===g.parents(".search-container").length&&c.$apply(function(){c.appEvent("hide-dash-search")}),!i&&!b.pinned&&j.find(".sidemenu").length>0&&0===g.parents(".sidemenu").length&&c.$apply(function(){c.contextSrv.toggleSideMenu()});var l=d.find(".popover");l.length>0&&0===g.parents(".graph-legend").length&&l.hide()}})}}}b.$inject=["playlistSrv","contextSrv"];var c,d,e,f,g,h,i;return a("grafanaAppDirective",b),{setters:[function(a){c=a},function(a){d=a},function(a){e=a},function(a){f=a},function(a){g=a},function(a){h=a}],execute:function(){i=function(){function a(a,b,e,f,i,j){a.init=function(){a.contextSrv=j,f.appSubUrl=c["default"].appSubUrl,a._=d["default"],g.profiler.init(c["default"],f),b.init(),e.init(),a.dashAlerts=b},a.initDashboard=function(b,c){a.appEvent("dashboard-fetch-end",b),i("DashboardCtrl",{$scope:c}).init(b)},f.onAppEvent=function(a,b,c){var d=f.$on(a,b),e=this;1!==e.$id||c||console.log("warning rootScope onAppEvent called without localscope"),c&&(e=c),e.$on("$destroy",d)},f.appEvent=function(a,b){f.$emit(a,b),h["default"].emit(a,b)},f.colors=["#7EB26D","#EAB839","#6ED0E0","#EF843C","#E24D42","#1F78C1","#BA43A9","#705DA0","#508642","#CCA300","#447EBC","#C15C17","#890F02","#0A437C","#6D1F62","#584477","#B7DBAB","#F4D598","#70DBED","#F9BA8F","#F29191","#82B5D8","#E5A8E2","#AEA2E0","#629E51","#E5AC0E","#64B0C8","#E0752D","#BF1B00","#0A50A1","#962D82","#614D93","#9AC48A","#F2C96D","#65C5DB","#F9934E","#EA6460","#5195CE","#D683CE","#806EB7","#3F6833","#967302","#2F575E","#99440A","#58140C","#052B51","#511749","#3F2B5B","#E0F9D7","#FCEACA","#CFFAFF","#F9E2D2","#FCE2DE","#BADFF4","#F9D9F9","#DEDAF7"],a.init()}return a.$inject=["$scope","alertSrv","utilSrv","$rootScope","$controller","contextSrv"],a}(),a("GrafanaCtrl",i),f["default"].directive("grafanaApp",b)}}});