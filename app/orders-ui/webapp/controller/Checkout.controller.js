sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("ordersui.controller.Checkout", {

        onInit: function () {
            var oFCL = this.byId("fcl");

            if (oFCL) {
                oFCL.setLayout("OneColumn");
            }
            this._loadFragment("COD");
        },

        onPaymentTypeChange: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();

            if (sKey === "COD") {
                this._loadFragment("COD");
            } else if (sKey === "BANK") {
                this._loadFragment("BankTransfer");
            } else if (sKey === "CARD") {
                this._loadFragment("CreditCard");
            }
        }, 

        onPlaceOrder: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("success");
        },

        _loadFragment: async function (sFragmentName) {
            const oContainer = this.byId("paymentContainer");
            if (!oContainer) { return; }

            oContainer.removeAllItems();

            const oFragment = await Fragment.load({
                name: "ordersui.view.fragments." + sFragmentName,
                controller: this
            });

            oContainer.addItem(oFragment);
        }, 

        onReviewOrder: function () {
            const oPaymentButton = this.byId("paymentSegmentedButton");
            const sPaymentType = oPaymentButton ? oPaymentButton.getSelectedKey() : "";

            const getValue = (sId) => {
                const oControl = this.byId(sId);
                return oControl && typeof oControl.getValue === "function" ? oControl.getValue() : "";
            };

            const oReviewData = {
                paymentType: sPaymentType,
                invoice: {
                    address: getValue("invoiceAddress"),
                    city: getValue("invoiceCity"),
                    zip: getValue("invoiceZipCode"),
                    country: getValue("invoiceCountry"),
                    note: getValue("invoiceNote")
                },
                shipping: {
                    address: getValue("shippingAddress"),
                    city: getValue("shippingCity"),
                    zip: getValue("shippingZipCode"),
                    country: getValue("shippingCountry"),
                    note: getValue("shippingNote")
                },
                cod: {
                    firstName: getValue("codFirstName"),
                    lastName: getValue("codLastName"),
                    phone: getValue("codPhone"),
                    email: getValue("codEmail")
                },
                card: {
                    holder: getValue("cardHolder"),
                    number: getValue("cardNumber"),
                    security: getValue("cardSecurity"),
                    expiry: getValue("cardExpiry")
                }
            };

            const oReviewModel = new JSONModel(oReviewData);
            this.getOwnerComponent().setModel(oReviewModel, "review");

            this.getOwnerComponent().getRouter().navTo("review");
        }
    });
});
