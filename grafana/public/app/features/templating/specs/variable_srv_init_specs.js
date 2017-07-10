/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["test/lib/common","../all","lodash","test/specs/helpers","app/core/core"],function(a){var b,c,d,e;return{setters:[function(a){b=a},function(a){},function(a){c=a},function(a){d=a},function(a){e=a}],execute:function(){b.describe("VariableSrv init",function(){function a(a,c){b.describe(a,function(){var a={urlParams:{},setup:function(b){a.setupFn=b}};b.beforeEach(function(){a.setupFn(),f.datasource={},f.datasource.metricFindQuery=b.sinon.stub().returns(f.$q.when(a.queryResult)),f.datasourceSrv.get=b.sinon.stub().returns(f.$q.when(f.datasource)),f.datasourceSrv.getMetricSources=b.sinon.stub().returns(a.metricSources),f.$location.search=b.sinon.stub().returns(a.urlParams),f.dashboard={templating:{list:a.variables},events:new e.Emitter},f.variableSrv.init(f.dashboard),f.$rootScope.$digest(),a.variables=f.variableSrv.variables}),c(a)})}var f=new d["default"].ControllerTestContext;b.beforeEach(b.angularMocks.module("grafana.core")),b.beforeEach(b.angularMocks.module("grafana.controllers")),b.beforeEach(b.angularMocks.module("grafana.services")),b.beforeEach(f.providePhase(["datasourceSrv","timeSrv","templateSrv","$location"])),b.beforeEach(b.angularMocks.inject(function(a,b,c,d){f.$q=b,f.$rootScope=a,f.$location=c,f.variableSrv=d.get("variableSrv"),f.$rootScope.$digest()})),["query","interval","custom","datasource"].forEach(function(c){a("when setting "+c+" variable via url",function(a){a.setup(function(){a.variables=[{name:"apps",type:c,current:{text:"test",value:"test"},options:[{text:"test",value:"test"}]}],a.urlParams["var-apps"]="new",a.metricSources=[]}),b.it("should update current value",function(){b.expect(a.variables[0].current.value).to.be("new"),b.expect(a.variables[0].current.text).to.be("new")})})}),b.describe("given dependent variables",function(){var d=[{name:"app",type:"query",query:"",current:{text:"app1",value:"app1"},options:[{text:"app1",value:"app1"}]},{name:"server",type:"query",refresh:1,query:"$app.*",current:{text:"server1",value:"server1"},options:[{text:"server1",value:"server1"}]}];a("when setting parent var from url",function(a){a.setup(function(){a.variables=c["default"].cloneDeep(d),a.urlParams["var-app"]="google",a.queryResult=[{text:"google-server1"},{text:"google-server2"}]}),b.it("should update child variable",function(){b.expect(a.variables[1].options.length).to.be(2),b.expect(a.variables[1].current.text).to.be("google-server1")}),b.it("should only update it once",function(){b.expect(f.datasource.metricFindQuery.callCount).to.be(1)})})}),a("when datasource variable is initialized",function(a){a.setup(function(){a.variables=[{type:"datasource",query:"graphite",name:"test",current:{value:"backend4_pee",text:"backend4_pee"},regex:"/pee$/"}],a.metricSources=[{name:"backend1",meta:{id:"influx"}},{name:"backend2_pee",meta:{id:"graphite"}},{name:"backend3",meta:{id:"graphite"}},{name:"backend4_pee",meta:{id:"graphite"}}]}),b.it("should update current value",function(){var a=f.variableSrv.variables[0];b.expect(a.options.length).to.be(2)})}),a("when template variable is present in url multiple times",function(a){a.setup(function(){a.variables=[{name:"apps",type:"query",multi:!0,current:{text:"val1",value:"val1"},options:[{text:"val1",value:"val1"},{text:"val2",value:"val2"},{text:"val3",value:"val3",selected:!0}]}],a.urlParams["var-apps"]=["val2","val1"]}),b.it("should update current value",function(){var a=f.variableSrv.variables[0];b.expect(a.current.value.length).to.be(2),b.expect(a.current.value[0]).to.be("val2"),b.expect(a.current.value[1]).to.be("val1"),b.expect(a.current.text).to.be("val2 + val1"),b.expect(a.options[0].selected).to.be(!0),b.expect(a.options[1].selected).to.be(!0)}),b.it("should set options that are not in value to selected false",function(){var a=f.variableSrv.variables[0];b.expect(a.options[2].selected).to.be(!1)})})})}}});