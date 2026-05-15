sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (
    Controller,
    UIComponent
) {

    "use strict";

    return Controller.extend(
        "ordersui.controller.Cart",
        {

            onNavBack: function () {

                const oAppModel =
                    this.getOwnerComponent()
                        .getModel("app");

                oAppModel.setProperty(
                    "/layout",
                    "TwoColumnsMidExpanded"
                );

                const oRouter =
                    UIComponent.getRouterFor(this);

                oRouter.navTo("master");
            }

        }
    );

});