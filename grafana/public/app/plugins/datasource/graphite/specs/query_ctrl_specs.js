/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["../query_ctrl","app/core/services/segment_srv","test/lib/common","../gfunc","test/specs/helpers"],function(a){var b,c,d,e;return{setters:[function(a){e=a},function(a){},function(a){b=a},function(a){c=a},function(a){d=a}],execute:function(){b.describe("GraphiteQueryCtrl",function(){var a=new d["default"].ControllerTestContext;b.beforeEach(b.angularMocks.module("grafana.core")),b.beforeEach(b.angularMocks.module("grafana.controllers")),b.beforeEach(b.angularMocks.module("grafana.services")),b.beforeEach(a.providePhase()),b.beforeEach(b.angularMocks.inject(function(c,d,f){a.$q=f,a.scope=c.$new(),a.target={target:"aliasByNode(scaleToSeconds(test.prod.*,1),2)"},a.datasource.metricFindQuery=b.sinon.stub().returns(a.$q.when([])),a.panelCtrl={panel:{}},a.panelCtrl.refresh=b.sinon.spy(),a.ctrl=d(e.GraphiteQueryCtrl,{$scope:a.scope},{panelCtrl:a.panelCtrl,datasource:a.datasource,target:a.target}),a.scope.$digest()})),b.describe("init",function(){b.it("should validate metric key exists",function(){b.expect(a.datasource.metricFindQuery.getCall(0).args[0]).to.be("test.prod.*")}),b.it("should delete last segment if no metrics are found",function(){b.expect(a.ctrl.segments[2].value).to.be("select metric")}),b.it("should parse expression and build function model",function(){b.expect(a.ctrl.functions.length).to.be(2)})}),b.describe("when adding function",function(){b.beforeEach(function(){a.ctrl.target.target="test.prod.*.count",a.ctrl.datasource.metricFindQuery=b.sinon.stub().returns(a.$q.when([{expandable:!1}])),a.ctrl.parseTarget(),a.ctrl.addFunction(c["default"].getFuncDef("aliasByNode"))}),b.it("should add function with correct node number",function(){b.expect(a.ctrl.functions[0].params[0]).to.be(2)}),b.it("should update target",function(){b.expect(a.ctrl.target.target).to.be("aliasByNode(test.prod.*.count, 2)")}),b.it("should call refresh",function(){b.expect(a.panelCtrl.refresh.called).to.be(!0)})}),b.describe("when adding function before any metric segment",function(){b.beforeEach(function(){a.ctrl.target.target="",a.ctrl.datasource.metricFindQuery.returns(a.$q.when([{expandable:!0}])),a.ctrl.parseTarget(),a.ctrl.addFunction(c["default"].getFuncDef("asPercent"))}),b.it("should add function and remove select metric link",function(){b.expect(a.ctrl.segments.length).to.be(0)})}),b.describe("when initalizing target without metric expression and only function",function(){b.beforeEach(function(){a.ctrl.target.target="asPercent(#A, #B)",a.ctrl.datasource.metricFindQuery.returns(a.$q.when([])),a.ctrl.parseTarget(),a.scope.$digest()}),b.it("should not add select metric segment",function(){b.expect(a.ctrl.segments.length).to.be(0)}),b.it("should add both series refs as params",function(){b.expect(a.ctrl.functions[0].params.length).to.be(2)})}),b.describe("when initializing a target with single param func using variable",function(){b.beforeEach(function(){a.ctrl.target.target="movingAverage(prod.count, $var)",a.ctrl.datasource.metricFindQuery.returns(a.$q.when([])),a.ctrl.parseTarget()}),b.it("should add 2 segments",function(){b.expect(a.ctrl.segments.length).to.be(2)}),b.it("should add function param",function(){b.expect(a.ctrl.functions[0].params.length).to.be(1)})}),b.describe("when initalizing target without metric expression and function with series-ref",function(){b.beforeEach(function(){a.ctrl.target.target="asPercent(metric.node.count, #A)",a.ctrl.datasource.metricFindQuery.returns(a.$q.when([])),a.ctrl.parseTarget()}),b.it("should add segments",function(){b.expect(a.ctrl.segments.length).to.be(3)}),b.it("should have correct func params",function(){b.expect(a.ctrl.functions[0].params.length).to.be(1)})}),b.describe("when getting altSegments and metricFindQuery retuns empty array",function(){b.beforeEach(function(){a.ctrl.target.target="test.count",a.ctrl.datasource.metricFindQuery.returns(a.$q.when([])),a.ctrl.parseTarget(),a.ctrl.getAltSegments(1).then(function(b){a.altSegments=b}),a.scope.$digest()}),b.it("should have no segments",function(){b.expect(a.altSegments.length).to.be(0)})}),b.describe("targetChanged",function(){b.beforeEach(function(){a.ctrl.datasource.metricFindQuery=b.sinon.stub().returns(a.$q.when([{expandable:!1}])),a.ctrl.parseTarget(),a.ctrl.target.target="",a.ctrl.targetChanged()}),b.it("should rebuld target after expression model",function(){b.expect(a.ctrl.target.target).to.be("aliasByNode(scaleToSeconds(test.prod.*, 1), 2)")}),b.it("should call panelCtrl.refresh",function(){b.expect(a.panelCtrl.refresh.called).to.be(!0)})})})}}});