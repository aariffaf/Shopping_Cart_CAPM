sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (
    Controller,
    UIComponent
) {
    "use strict";

    return Controller.extend("ordersui.controller.Cart", {

        onNavBack: function () {
            const oAppModel = this.getOwnerComponent().getModel("app");
            oAppModel.setProperty("/layout", "TwoColumnsMidExpanded");

            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("master");
        },

        onDeleteItem: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const sPath = oItem.getBindingContext("cart").getPath();
            const oCartModel = this.getOwnerComponent().getModel("cart");
            const aItems = oCartModel.getProperty("/items");
            const iIndex = parseInt(sPath.split("/")[2]);

            aItems.splice(iIndex, 1);
            oCartModel.setProperty("/items", aItems);

            // 2. Open the confirmation dialog box
            MessageBox.confirm("Do you want to remove this entry from your cart?", {
                title: "Confirmation",
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.DELETE,

                // 3. Handle the user choice
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.DELETE) {
                        // User clicked Delete: Remove data from model
                        var aItems = oModel.getProperty("/items");

                        // Extract index from path (e.g., "/items/0" -> 0)
                        var iIndex = parseInt(sPath.split("/").pop(), 10);

                        aItems.splice(iIndex, 1);
                        oModel.setProperty("/items", aItems);

                        MessageToast.show("Item removed successfully.");
                    } else {
                        // User clicked Cancel: Do nothing, item stays in list
                        MessageToast.show("Deletion canceled.");
                    }
                }
            });
        }
    }
    );
});
