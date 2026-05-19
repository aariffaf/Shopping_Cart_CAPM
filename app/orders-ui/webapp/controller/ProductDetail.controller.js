sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ordersui.controller.ProductDetail", {

        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();

            oRouter.getRoute("productDetail")
                .attachPatternMatched(this._onMatched, this);
        },

        _onMatched: function (oEvent) {

            var sId = oEvent.getParameter("arguments").productId;

            this.getView().bindElement({
                path: "/Products_define('" + sId + "')"
            });
        },

        onAddToCart: function () {

            const oCartModel = this.getOwnerComponent()
                .getModel("cart");

            const aItems = oCartModel.getProperty("/items");

            const oData = this.getView()
                .getBindingContext()
                .getObject();

            aItems.push({
                ID: oData.ID,
                productName: oData.productName,
                supplierName: oData.supplierName,
                productImage: oData.productImage,
                price: oData.price,
                currency: oData.currency,
                availability: oData.availability
            });

            oCartModel.setProperty("/items", aItems);

            sap.m.MessageToast.show("Added to cart");

        },

        onNavBack: function () {
            window.history.back();
        }

    });
});