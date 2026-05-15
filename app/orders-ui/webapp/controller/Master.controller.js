sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    "use strict";

    return Controller.extend("ordersui.controller.Master", {

        onCategoryPress: function (oEvent) {

            const oItem =
                oEvent.getParameter("listItem");

            const oContext =
                oItem.getBindingContext();

            const sCategory =
                oContext.getProperty("Category");

            const oEventBus =
                sap.ui.getCore().getEventBus();

            oEventBus.publish(
                "category",
                "selected",
                {
                    category: sCategory
                }
            );
        }

    });

});