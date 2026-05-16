sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("ordersui.controller.CategoryProducts", {

        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.getRoute("categoryProducts")
                .attachPatternMatched(this._onCategoryMatched, this);
        },

        _onCategoryMatched: function (oEvent) {

            var sCategory = oEvent.getParameter("arguments").category;

            var oList = this.byId("productsList");

            var oBinding = oList.getBinding("items");

            oBinding.filter([
                new sap.ui.model.Filter(
                    "mainCategory",
                    sap.ui.model.FilterOperator.EQ,
                    sCategory
                )
            ]);
        },

        onProductPress: function (oEvent) {

            var sId = oEvent.getSource()
                .getBindingContext()
                .getObject().ID;

            this.getOwnerComponent()
                .getRouter()
                .navTo("productDetail", {
                    productId: sId
                });
        },

        onNavBack: function () {

            this.getOwnerComponent()
                .getRouter()
                .navTo("master", {}, true);
        }

    });
});