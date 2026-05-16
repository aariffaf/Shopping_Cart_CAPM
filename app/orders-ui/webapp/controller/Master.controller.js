sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    "use strict";

    return Controller.extend("ordersui.controller.Master", {

        onCategoryPress: function (oEvent) {

            var sCategory = oEvent.getSource()
                .getBindingContext()
                .getProperty("categoryName");

            this.getOwnerComponent()
                .getRouter()
                .navTo("categoryProducts", {
                    category: sCategory
                }, true
            );
        }

    });

});