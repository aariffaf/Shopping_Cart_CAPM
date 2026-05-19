sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"
], function (
    Controller,
    Filter,
    FilterOperator,
    JSONModel,
    UIComponent
) {

    "use strict";

    return Controller.extend("ordersui.controller.Home", {

        onInit: function () {

            const oEventBus =
                sap.ui.getCore().getEventBus();

            oEventBus.subscribe(
                "category",
                "selected",
                this.onCategorySelected,
                this
            );
        },

        onCategorySelected: function (
            sChannel,
            sEvent,
            oData
        ) {

            const oGrid =
                this.byId("productsGrid");

            const oBinding =
                oGrid.getBinding("items");

            const oFilter =
                new sap.ui.model.Filter(
                    "mainCategory",
                    sap.ui.model.FilterOperator.EQ,
                    oData.category
                );

            oBinding.filter([oFilter]);
        },


        onAddToCart: function (oEvent) {

            const oContext =
                oEvent.getSource()
                    .getBindingContext();

            const oProduct =
                oContext.getObject();

            const oCartModel =
                this.getOwnerComponent()
                    .getModel("cart");

            const aItems =
                oCartModel.getProperty("/items");

            aItems.push({

                productName:
                    oProduct.productName,

                price:
                    oProduct.price,

                currency:
                    oProduct.currency

            });

            oCartModel.setProperty(
                "/items",
                aItems
            );

            sap.m.MessageToast.show(
                "Added to Cart"
            );
        },

        onOpenCart: function () {

            const oAppModel =
                this.getOwnerComponent()
                    .getModel("app");

            oAppModel.setProperty(
                "/layout",
                "ThreeColumnsMidExpanded"
            );

            const oRouter =
                sap.ui.core.UIComponent
                    .getRouterFor(this);

            oRouter.navTo("cart");
        },

        onCategoryPress: function (oEvent) {

            var oItem = oEvent.getSource();

            var sCategory = oItem.getBindingContext()
                .getProperty("categoryName");

            this.getOwnerComponent().getRouter()
                .navTo("categoryProducts", {
                    category: sCategory
                });
        },
        onOpenOrders: function () {

            this.getOwnerComponent()
                .getRouter()
                .navTo("orders");
        }
    });

});