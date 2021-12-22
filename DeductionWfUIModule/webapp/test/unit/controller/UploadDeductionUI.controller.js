/*global QUnit*/

sap.ui.define([
	"comacn./DeductionWfUIModule/controller/UploadDeductionUI.controller"
], function (Controller) {
	"use strict";

	QUnit.module("UploadDeductionUI Controller");

	QUnit.test("I should test the UploadDeductionUI controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
