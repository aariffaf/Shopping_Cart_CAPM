sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
], function (
    Controller,
    UIComponent,
    MessageToast
) {

    "use strict";

    return Controller.extend(
        "ordersui.controller.Orders",
        {

            onNavBack: function () {

                const oRouter =
                    UIComponent.getRouterFor(this);

                oRouter.navTo("master");
            },

            onViewOrderDetails: function (oEvent) {

                const oContext =
                    oEvent.getSource()
                        .getBindingContext();

                const oData =
                    oContext.getObject();

                this.getOwnerComponent()
                    .getModel("layoutModel")
                    .setProperty(
                        "/layout",
                        "TwoColumnsMidExpanded"
                    );


                this.getOwnerComponent()
                    .getRouter()
                    .navTo(
                        "orderDetail",
                        {
                            orderId: oData.ID
                        }
                    );
            }
        });
});