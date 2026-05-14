sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "ordersui/model/models"
], function (UIComponent, JSONModel, models) {

    "use strict";

    return UIComponent.extend("ordersui.Component", {
//Tells the app to look at manifest.json for configurations (like routing and data sources).
        metadata: {
            manifest: "json"
        },

        init: function () {
// Runs the standard setup for a SAPUI5 component.
            UIComponent.prototype.init.apply(this, arguments);
// Sets up a model to check if the user is on a phone, tablet, or desktop.
            this.setModel(models.createDeviceModel(), "device");

            const oAppModel = new JSONModel({
                layout: "OneColumn"
            });

            this.setModel(oAppModel, "app");

            this.getRouter().initialize();
        }
    });
});