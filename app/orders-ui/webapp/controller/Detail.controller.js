sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (
    Controller,
    MessageToast
) {

    "use strict";

    return Controller.extend("ordersui.controller.Detail", {

        // ─── Lifecycle ────────────────────────────────────────────────

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("detail")
                .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sOrderId = oEvent.getParameter("arguments").orderId;

            this.getView().bindElement({
                path: "/Orders(" + sOrderId + ")",
                parameters: {
                    $expand: "shippingAddress,items,processor"
                },
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        _onDataReceived: function () {
            const oContext = this.getView().getBindingContext();
            if (!oContext) { return; }

            // Update Line Items table header count e.g. "Line Items (3)"
            const aItems = oContext.getProperty("items");
            const iCount = Array.isArray(aItems) ? aItems.length : 0;
            const oTitle = this.byId("lineItemsTitle");
            if (oTitle) {
                oTitle.setText("Line Items (" + iCount + ")");
            }

            // Set processor avatar initials from name if no photo
            const sName     = oContext.getProperty("processor/name") || "";
            const aParts    = sName.trim().split(" ");
            const sInitials = aParts.length >= 2
                ? aParts[0].charAt(0).toUpperCase() + aParts[aParts.length - 1].charAt(0).toUpperCase()
                : sName.charAt(0).toUpperCase();

            const oAvatar = this.byId("processorAvatar");
            if (oAvatar && !oContext.getProperty("processor/photoUrl")) {
                oAvatar.setInitials(sInitials);
            }
        },

        // ─── Close Panel ──────────────────────────────────────────────

        onCloseDetail: function () {
            this.getOwnerComponent()
                .getModel("app")
                .setProperty("/layout", "OneColumn");

            this.getOwnerComponent()
                .getRouter()
                .navTo("master");
        },

        // ─── Expand / Restore ─────────────────────────────────────────

        onExpandDetail: function () {
            const oAppModel = this.getOwnerComponent().getModel("app");
            const sLayout   = oAppModel.getProperty("/layout");

            if (sLayout === "MidColumnFullScreen") {
                oAppModel.setProperty("/layout", "TwoColumnsMidExpanded");
            } else {
                oAppModel.setProperty("/layout", "MidColumnFullScreen");
            }
        },

        // ─── Email Order ──────────────────────────────────────────────

        onEmailOrder: function () {
            const oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageToast.show("No order loaded.");
                return;
            }

            const sOrderNo  = oContext.getProperty("orderNo")            || "";
            const sCustomer = oContext.getProperty("customerName")       || "";
            const sPrice    = oContext.getProperty("totalPrice")         || "";
            const sCurrency = oContext.getProperty("currency")           || "";
            const sOrdered  = oContext.getProperty("orderDate")          || "";
            const sShipped  = oContext.getProperty("shippedDate")        || "";
            const sName     = oContext.getProperty("shippingAddress/name")    || "";
            const sStreet   = oContext.getProperty("shippingAddress/street")  || "";
            const sCity     = oContext.getProperty("shippingAddress/city")    || "";
            const sCountry  = oContext.getProperty("shippingAddress/country") || "";

            const sSubject = encodeURIComponent("Order Details: " + sOrderNo);
            const sBody    = encodeURIComponent(
                "Hello,\n\n" +
                "Order No    : " + sOrderNo  + "\n" +
                "Customer    : " + sCustomer + "\n" +
                "Ordered     : " + sOrdered  + "\n" +
                "Shipped     : " + sShipped  + "\n" +
                "Total Price : " + sPrice + " " + sCurrency + "\n\n" +
                "Ship To:\n" +
                "  " + sName    + "\n" +
                "  " + sStreet  + "\n" +
                "  " + sCity    + "\n" +
                "  " + sCountry + "\n\n" +
                "Kind regards"
            );

            window.location.href = "mailto:?subject=" + sSubject + "&body=" + sBody;
        }

    });
});