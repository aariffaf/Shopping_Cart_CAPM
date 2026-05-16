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

            var oProduct = this.getView()
                .getBindingContext()
                .getObject();

            var oComponent = this.getOwnerComponent();

            var aCart = oComponent.getModel("cart")
                .getProperty("/items");

            aCart.push(oProduct);

            oComponent.getModel("cart")
                .setProperty("/items", aCart);

            sap.m.MessageToast.show("Added to cart");

            oComponent.getRouter()
                .navTo("cart");
        },

        onNavBack: function () {
            window.history.back();
        }

    });
});