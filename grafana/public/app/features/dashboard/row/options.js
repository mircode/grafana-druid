/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/core"],function(a){function b(){return{restrict:"E",templateUrl:"public/app/features/dashboard/row/options.html",controller:d,bindToController:!0,controllerAs:"ctrl",scope:{rowCtrl:"="}}}var c,d;return a("rowOptionsDirective",b),{setters:[function(a){c=a}],execute:function(){d=function(){function a(a,b,c){this.$scope=a,this.$timeout=b,this.$rootScope=c,this.fontSizes=["h1","h2","h3","h4","h5","h6"],this.row=this.rowCtrl.row,this.dashboard=this.rowCtrl.dashboard,this.row.titleSize=this.row.titleSize||"h6"}return a.$inject=["$scope","$timeout","$rootScope"],a}(),a("RowOptionsCtrl",d),c.coreModule.directive("dashRowOptions",b)}}});