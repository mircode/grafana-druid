/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/features/panel/panel_ctrl","app/features/panel/metrics_panel_ctrl","app/features/panel/query_ctrl","app/features/alerting/alert_tab_ctrl","app/core/config"],function(a){function b(a){g["default"].bootData.user.lightTheme?System["import"](a.light+"!css"):System["import"](a.dark+"!css")}var c,d,e,f,g;return a("loadPluginCss",b),{setters:[function(a){c=a},function(a){d=a},function(a){e=a},function(a){f=a},function(a){g=a}],execute:function(){a("PanelCtrl",c.PanelCtrl),a("MetricsPanelCtrl",d.MetricsPanelCtrl),a("QueryCtrl",e.QueryCtrl),a("alertTab",f.alertTab)}}});