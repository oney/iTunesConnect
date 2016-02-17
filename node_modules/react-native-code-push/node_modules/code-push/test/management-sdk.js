/// <reference path="../definitions/harness.d.ts" />
var assert = require("assert");
var Q = require("q");
var account_manager_1 = require("../script/management/account-manager");
var request = require("superagent");
var manager;
describe("Management SDK", function () {
    beforeEach(function () {
        manager = new account_manager_1.AccountManager("http://localhost", "unit-test/1.0.0");
    });
    after(function () {
        // Prevent an exception that occurs due to how superagent-mock overwrites methods
        request.Request.prototype._callback = function () { };
    });
    it("methods reject the promise with status code info when an error occurs", function (done) {
        mockReturn("Text", 404);
        var methodsWithErrorHandling = [
            manager.addApp.bind(manager, "appName"),
            manager.getApp.bind(manager, "appId"),
            manager.updateApp.bind(manager, {}),
            manager.removeApp.bind(manager, "appId"),
            manager.addDeployment.bind(manager, "appId", "name"),
            manager.getDeployment.bind(manager, "appId", "deploymentId"),
            manager.getDeployments.bind(manager, "appId"),
            manager.updateDeployment.bind(manager, "appId", { id: "deploymentToChange" }),
            manager.removeDeployment.bind(manager, "appId", { id: "deploymentToChange" }),
            manager.getDeploymentKeys.bind(manager, "appId", "deploymentId"),
            manager.getPackage.bind(manager, ""),
            manager.logout.bind(manager),
        ];
        var result = Q(null);
        methodsWithErrorHandling.forEach(function (f) {
            result = result.then(function () {
                return testErrors(f);
            });
        });
        result.done(function () {
            done();
        });
        // Test that the proper error code and text is passed through on a server error
        function testErrors(method) {
            return Q.Promise(function (resolve, reject, notify) {
                method().done(function () {
                    assert.fail("Should have thrown an error");
                    reject();
                }, function (error) {
                    assert.equal(error.message, "Text");
                    resolve();
                });
            });
        }
    });
    it("isAuthenticated handles successful auth", function (done) {
        mockReturn(JSON.stringify({ authenticated: true }), 200, {});
        manager.isAuthenticated().done(function (authenticated) {
            assert(authenticated, "Should be authenticated");
            done();
        });
    });
    it("isAuthenticated handles unsuccessful auth", function (done) {
        mockReturn("Unauthorized", 401, {});
        manager.isAuthenticated().done(function (authenticated) {
            assert(!authenticated, "Should not be authenticated");
            done();
        });
    });
    it("isAuthenticated handles unexpected status codes", function (done) {
        mockReturn("Not Found", 404, {});
        manager.isAuthenticated().done(function (authenticated) {
            assert.fail("isAuthenticated should have rejected the promise");
            done();
        }, function (err) {
            assert.equal(err.message, "Not Found", "Error message should be 'Not Found'");
            done();
        });
    });
    it("addApp handles location header", function (done) {
        mockReturn(JSON.stringify({ success: true }), 200, { location: "/appId" });
        manager.addApp("appName").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("addApp handles missing location header", function (done) {
        mockReturn(JSON.stringify({ success: true }), 200, {});
        manager.addApp("appName").done(function (obj) {
            assert.ok(!obj);
            done();
        }, rejectHandler);
    });
    it("getApp handles JSON response", function (done) {
        mockReturn(JSON.stringify({ app: {} }), 200, {});
        manager.getApp("appId").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("updateApp handles success response", function (done) {
        mockReturn(JSON.stringify({ apps: [] }), 200, {});
        manager.updateApp({}).done(function (obj) {
            assert.ok(!obj);
            done();
        }, rejectHandler);
    });
    it("removeApp handles success response", function (done) {
        mockReturn("", 200, {});
        manager.removeApp("appId").done(function (obj) {
            assert.ok(!obj);
            done();
        }, rejectHandler);
    });
    it("addDeployment handles success response", function (done) {
        mockReturn("", 200, { location: "/deploymentId" });
        manager.addDeployment("appId", "name").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("addDeployment handles missing location header", function (done) {
        mockReturn("", 200, {});
        manager.addDeployment("appId", "name").done(function (obj) {
            assert.ok(!obj);
            done();
        }, rejectHandler);
    });
    it("getDeployment handles JSON response", function (done) {
        mockReturn(JSON.stringify({ deployment: {} }), 200, {});
        manager.getDeployment("appId", "deploymentId").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("getDeployments handles JSON response", function (done) {
        mockReturn(JSON.stringify({ deployments: [] }), 200, {});
        manager.getDeployments("appId").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("updateDeployment handles success response", function (done) {
        mockReturn(JSON.stringify({ apps: [] }), 200, {});
        manager.updateDeployment("appId", { id: "deploymentId" }).done(function (obj) {
            assert.ok(!obj);
            done();
        }, rejectHandler);
    });
    it("removeDeployment handles success response", function (done) {
        mockReturn("", 200, {});
        manager.removeDeployment("appId", "deploymentId").done(function (obj) {
            assert.ok(!obj);
            done();
        }, rejectHandler);
    });
    it("getDeploymentKeys handles JSON response", function (done) {
        mockReturn(JSON.stringify({ deploymentKeys: [] }), 200, {});
        manager.getDeploymentKeys("appId", "deploymentId").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("getPackage handles success response", function (done) {
        mockReturn(JSON.stringify({ package: {} }), 200);
        manager.getPackage("appId", "deploymentId").done(function (obj) {
            assert.ok(obj);
            done();
        }, rejectHandler);
    });
    it("getPackageHistory handles success response with no packages", function (done) {
        mockReturn(JSON.stringify({ packageHistory: [] }), 200);
        manager.getPackageHistory("appId", "deploymentId").done(function (obj) {
            assert.ok(obj);
            assert.equal(obj.length, 0);
            done();
        }, rejectHandler);
    });
    it("getPackageHistory handles success response with two packages", function (done) {
        mockReturn(JSON.stringify({ packageHistory: [{ label: "v1" }, { label: "v2" }] }), 200);
        manager.getPackageHistory("appId", "deploymentId").done(function (obj) {
            assert.ok(obj);
            assert.equal(obj.length, 2);
            assert.equal(obj[0].label, "v1");
            assert.equal(obj[1].label, "v2");
            done();
        }, rejectHandler);
    });
    it("getPackageHistory handles error response", function (done) {
        mockReturn("", 404);
        manager.getPackageHistory("appId", "deploymentId").done(function (obj) {
            throw new Error("Call should not complete successfully");
        }, function (error) { return done(); });
    });
});
// Helper method that is used everywhere that an assert.fail() is needed in a promise handler
function rejectHandler(val) {
    assert.fail();
}
// Wrapper for superagent-mock that abstracts away information not needed for SDK tests
function mockReturn(bodyText, statusCode, header) {
    if (header === void 0) { header = {}; }
    require("superagent-mock")(request, [{
            pattern: "http://localhost/(\\w+)/?",
            fixtures: function (match, params) {
                var isOk = statusCode >= 200 && statusCode < 300;
                if (!isOk) {
                    var err = new Error(bodyText);
                    err.status = statusCode;
                    throw err;
                }
                return { text: bodyText, status: statusCode, ok: isOk, header: header, headers: {} };
            },
            callback: function (match, data) { return data; }
        }]);
}
