/*! grafana - v4.0.2 - 2016-12-13
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["../../../../../test/lib/common","moment","../module","../../../../../test/specs/helpers"],function(a){var b,c,d,e;return{setters:[function(a){b=a},function(a){c=a},function(a){d=a},function(a){e=a}],execute:function(){b.describe("GraphCtrl",function(){var a=new e["default"].ControllerTestContext;b.beforeEach(b.angularMocks.module("grafana.services")),b.beforeEach(b.angularMocks.module("grafana.controllers")),b.beforeEach(a.providePhase()),b.beforeEach(a.createPanelController(d.GraphCtrl)),b.beforeEach(function(){a.ctrl.annotationsPromise=Promise.resolve({}),a.ctrl.updateTimeRange()}),b.describe("when time series are outside range",function(){b.beforeEach(function(){var b=[{target:"test.cpu1",datapoints:[[45,1234567890],[60,1234567899]]}];a.ctrl.range={from:c["default"]().valueOf(),to:c["default"]().valueOf()},a.ctrl.onDataReceived(b)}),b.it("should set datapointsOutside",function(){b.expect(a.ctrl.datapointsOutside).to.be(!0)})}),b.describe("when time series are inside range",function(){b.beforeEach(function(){var b={from:c["default"]().subtract(1,"days").valueOf(),to:c["default"]().valueOf()},d=[{target:"test.cpu1",datapoints:[[45,b.from+1e3],[60,b.from+1e4]]}];a.ctrl.range=b,a.ctrl.onDataReceived(d)}),b.it("should set datapointsOutside",function(){b.expect(a.ctrl.datapointsOutside).to.be(!1)})}),b.describe("datapointsCount given 2 series",function(){b.beforeEach(function(){var b=[{target:"test.cpu1",datapoints:[[45,1234567890],[60,1234567899]]},{target:"test.cpu2",datapoints:[[45,1234567890]]}];a.ctrl.onDataReceived(b)}),b.it("should set datapointsCount to sum of datapoints",function(){b.expect(a.ctrl.datapointsCount).to.be(3)})})})}}});