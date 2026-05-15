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
                    "categoryCode",
                    sap.ui.model.FilterOperator.EQ,
                    oData.category
                );

            oBinding.filter([oFilter]);
        }

    });

});