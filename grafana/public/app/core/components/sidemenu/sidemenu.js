/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/config","jquery","../../core_module"],function(a){function b(){return{restrict:"E",templateUrl:"public/app/core/components/sidemenu/sidemenu.html",controller:f,bindToController:!0,controllerAs:"ctrl",scope:{},link:function(a,b){b.on("click.dropdown",".dropdown-menu a",function(a){var b=d["default"](a.target).parents(".dropdown-menu"),c=b.parent();b.detach(),setTimeout(function(){c.append(b)},100)}),a.$on("$destory",function(){b.off("click.dropdown")})}}}var c,d,e,f;return a("sideMenuDirective",b),{setters:[function(a){c=a},function(a){d=a},function(a){e=a}],execute:function(){f=function(){function a(a,b,d,e,f){var g=this;this.$scope=a,this.$location=b,this.contextSrv=d,this.backendSrv=e,this.$element=f,this.isSignedIn=d.isSignedIn,this.user=d.user,this.appSubUrl=c["default"].appSubUrl,this.showSignout=this.contextSrv.isSignedIn&&!c["default"].authProxyEnabled,this.maxShownOrgs=10,this.mainLinks=c["default"].bootData.mainNavLinks,this.openUserDropdown(),this.loginUrl="login?redirect="+encodeURIComponent(this.$location.path()),this.$scope.$on("$routeChangeSuccess",function(){g.contextSrv.pinned||(g.contextSrv.sidemenu=!1),g.loginUrl="login?redirect="+encodeURIComponent(g.$location.path())}),this.orgFilter=""}return a.$inject=["$scope","$location","contextSrv","backendSrv","$element"],a.prototype.getUrl=function(a){return c["default"].appSubUrl+a},a.prototype.openUserDropdown=function(){var a=this;this.orgMenu=[{section:"You",cssClass:"dropdown-menu-title"},{text:"Profile",url:this.getUrl("/profile")}],this.isSignedIn&&this.orgMenu.push({text:"Sign out",url:this.getUrl("/logout"),target:"_self"}),this.contextSrv.hasRole("Admin")&&(this.orgMenu.push({section:this.user.orgName,cssClass:"dropdown-menu-title"}),this.orgMenu.push({text:"Preferences",url:this.getUrl("/org")}),this.orgMenu.push({text:"Users",url:this.getUrl("/org/users")}),this.orgMenu.push({text:"API Keys",url:this.getUrl("/org/apikeys")})),this.orgMenu.push({cssClass:"divider"}),this.backendSrv.get("/api/user/orgs").then(function(b){a.orgs=b,a.loadOrgsItems()})},a.prototype.loadOrgsItems=function(){var a=this;this.orgItems=[],this.orgs.forEach(function(b){b.orgId!==a.contextSrv.user.orgId&&a.orgItems.length<a.maxShownOrgs&&(""===a.orgFilter||b.name.indexOf(a.orgFilter)!==-1)&&a.orgItems.push({text:"Switch to "+b.name,icon:"fa fa-fw fa-random",url:a.getUrl("/profile/switch-org/"+b.orgId),target:"_self"})}),c["default"].allowOrgCreate&&this.orgItems.push({text:"New organization",icon:"fa fa-fw fa-plus",url:this.getUrl("/org/new")})},a}(),a("SideMenuCtrl",f),e["default"].directive("sidemenu",b)}}});