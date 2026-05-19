sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
], function (Controller, UIComponent, MessageToast) {
    "use strict";

    return Controller.extend("ordersui.controller.Review", {

        onNavBack: function () {

            window.history.back();

        },

        onEditCheckout: function () {

            const oRouter = UIComponent.getRouterFor(this);

            oRouter.navTo("checkout");

        },

        onPlaceOrder: async function () {

            const oReview =
                this.getOwnerComponent()
                    .getModel("review")
                    .getData();

            const oCart =
                this.getOwnerComponent()
                    .getModel("cart")
                    .getData();

            const oModel =
                this.getOwnerComponent()
                    .getModel();

            const sOrderNumber =
                "ORD-" + Date.now();

            const fTotal =
                oCart.items.reduce((sum, item) => {
                    return sum + Number(item.price || 0);
                }, 0);

            const oOrderPayload = {

                orderNumber: sOrderNumber,

                customerName:
                    oReview.cod?.firstName || "Guest",

                paymentType:
                    oReview.paymentType,

                totalAmount:
                    fTotal,

                currency:
                    "EUR",

                orderDate:
                    new Date().toISOString(),

                invoiceAddress:
                    oReview.invoice.address,

                shippingAddress:
                    oReview.shipping.address
            };

            const oBinding =
                oModel.bindList("/ConfirmedOrders");

            const oContext =
                oBinding.create(oOrderPayload);

            await oContext.created();

            const sOrderId =
                oContext.getObject().ID;

            const oItemsBinding =
                oModel.bindList("/ConfirmedOrderItems");

            oCart.items.forEach(function (item) {

                oItemsBinding.create({

                    order_ID: sOrderId,

                    productName: item.productName,

                    quantity: 1,

                    price: item.price,

                    currency: item.currency,

                    productImage: item.productImage
                });

            });

            sap.m.MessageToast.show(
                "Order Saved Successfully"
            );

            this.getOwnerComponent()
                .getRouter()
                .navTo("success");
        }

    });

});