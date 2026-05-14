sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/ViewSettingsDialog",
    "sap/m/ViewSettingsItem",
    "sap/m/ViewSettingsFilterItem"
], function (
    Controller,
    Filter,
    FilterOperator,
    Sorter,
    JSONModel,
    MessageToast,
    ViewSettingsDialog,
    ViewSettingsItem,
    ViewSettingsFilterItem
) {

    "use strict";

    return Controller.extend("ordersui.controller.Master", {

        // ─── Lifecycle ────────────────────────────────────────────────

        onInit: function () {
            const oViewModel = new JSONModel({
                isFiltered: false,
                isSorted: false,
                isGrouped: false,
                isSearched: false
            });
            this.getView().setModel(oViewModel, "masterView");

            this._searchFilter = null;
            this._activeFilters = [];
            this._activeSorter = null;
            this._activeGrouper = null;
        },

        // ─── Navigation ───────────────────────────────────────────────

        onPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext();
            const sOrderID = oContext.getProperty("ID");

            this.getOwnerComponent()
                .getModel("app")
                .setProperty("/layout", "TwoColumnsMidExpanded");

            this.getOwnerComponent()
                .getRouter()
                .navTo("detail", { orderId: sOrderID });
        },

        // ─── Search ───────────────────────────────────────────────────

        onSearch: function (oEvent) {
            try {
                const sValue = oEvent.getParameter("newValue") ||
                    oEvent.getParameter("query") || "";

                const oViewModel = this.getView().getModel("masterView");

                if (sValue && sValue.trim().length > 0) {
                    this._searchFilter = new Filter(
                        "customerName",
                        FilterOperator.Contains,
                        sValue.trim()
                    );
                    oViewModel.setProperty("/isSearched", true);
                } else {
                    this._searchFilter = null;
                    oViewModel.setProperty("/isSearched", false);
                }

                this._applyFilters();

            } catch (oError) {
                MessageToast.show("Search error: " + oError.message);
            }
        },

        // ─── Filter ───────────────────────────────────────────────────

        onFilter: function () {
            if (!this._oFilterDialog) {
                this._oFilterDialog = new ViewSettingsDialog({
                    title: "Filter Orders",
                    filterItems: [
                        new ViewSettingsFilterItem({
                            text: "Currency",
                            key: "currency",
                            items: [
                                new ViewSettingsItem({ text: "USD", key: "USD" }),
                                new ViewSettingsItem({ text: "EUR", key: "EUR" }),
                                new ViewSettingsItem({ text: "GBP", key: "GBP" }),
                                new ViewSettingsItem({ text: "INR", key: "INR" })
                            ]
                        })
                    ],
                    confirm: this._onFilterConfirm.bind(this),
                    cancel: function () { }
                });
                this.getView().addDependent(this._oFilterDialog);
            }
            this._oFilterDialog.open();
        },

        _onFilterConfirm: function (oEvent) {
            const mParams = oEvent.getParameters();
            const oViewModel = this.getView().getModel("masterView");

            this._activeFilters = [];
            mParams.filterItems.forEach(function (oItem) {
                this._activeFilters.push(
                    new Filter("currency", FilterOperator.EQ, oItem.getKey())
                );
            }.bind(this));

            const bFiltered = this._activeFilters.length > 0;
            oViewModel.setProperty("/isFiltered", bFiltered);
            this._applyFilters();

            if (bFiltered) {
                MessageToast.show(this._activeFilters.length + " filter(s) applied.");
            }
        },

        // ─── Sort ─────────────────────────────────────────────────────

        onSort: function () {
            var that = this; // Save the controller reference

            if (!this._oSortDialog) {
                this._oSortDialog = new ViewSettingsDialog({
                    title: "Sort Orders",
                    sortItems: [
                        new ViewSettingsItem({ text: "Order No", key: "orderNo" }),
                        new ViewSettingsItem({ text: "Total Price", key: "totalPrice" })
                    ],
                    // Use 'that' to ensure we find the function correctly
                    confirm: that._onSortConfirm.bind(that),
                    cancel: function () { }
                });
                this.getView().addDependent(this._oSortDialog);
            }
            this._oSortDialog.open();
        },

        _onSortConfirm: function (oEvent) {
            const mParams = oEvent.getParameters();
            const sPath = mParams.sortItem.getKey(); // e.g., "orderNo"
            const bDescending = mParams.sortDescending;

            // 1. Create the Sorter object
            const oSorter = new Sorter(sPath, bDescending);

            // 2. Get the List and its items binding
            const oList = this.byId("ordersList");
            const oBinding = oList.getBinding("items");

            // 3. Apply the sorter directly to the binding
            // This triggers a new request to the server with $orderby
            oBinding.sort(oSorter);

            MessageToast.show("Sorted by " + mParams.sortItem.getText());
        },

        // ─── Group ────────────────────────────────────────────────────

        onGroup: function () {
            if (!this._oGroupDialog) {
                this._oGroupDialog = new ViewSettingsDialog({
                    title: "Group Orders",
                    groupItems: [
                        new ViewSettingsItem({ text: "Currency", key: "currency" }),
                        new ViewSettingsItem({ text: "Customer Name", key: "customerName" }),
                        new ViewSettingsItem({ text: "Shipped Date", key: "shippedDate" })
                    ],
                    confirm: this._onGroupConfirm.bind(this),
                    cancel: function () { }
                });
                this.getView().addDependent(this._oGroupDialog);
            }
            this._oGroupDialog.open();
        },

        _onGroupConfirm: function (oEvent) {
            const mParams = oEvent.getParameters();
            const oViewModel = this.getView().getModel("masterView");

            if (mParams.groupItem) {
                const bDesc = mParams.groupDescending;
                this._activeGrouper = new Sorter(
                    mParams.groupItem.getKey(), bDesc, true
                );
                oViewModel.setProperty("/isGrouped", true);
                this._applySorters();
                MessageToast.show("Grouped by " + mParams.groupItem.getText());
            } else {
                this._activeGrouper = null;
                oViewModel.setProperty("/isGrouped", false);
                this._applySorters();
            }
        },

        // ─── Reset ────────────────────────────────────────────────────

        onReset: function () {
            const oViewModel = this.getView().getModel("masterView");
            const oBinding = this.byId("ordersList").getBinding("items");

            const oSearchField = this.byId("searchField");
            if (oSearchField) { oSearchField.setValue(""); }

            this._searchFilter = null;
            this._activeFilters = [];
            this._activeSorter = null;
            this._activeGrouper = null;

            oBinding.filter([]);
            oBinding.sort([]);

            if (this._oSortDialog) { this._oSortDialog.clearSelections(); }
            if (this._oFilterDialog) { this._oFilterDialog.clearSelections(); }
            if (this._oGroupDialog) { this._oGroupDialog.clearSelections(); }

            oViewModel.setProperty("/isFiltered", false);
            oViewModel.setProperty("/isSorted", false);
            oViewModel.setProperty("/isGrouped", false);
            oViewModel.setProperty("/isSearched", false);

            MessageToast.show("All filters, sorting and grouping have been reset.");
        },

        // ─── Internal Helpers ─────────────────────────────────────────

        _applyFilters: function () {
            const oBinding = this.byId("ordersList").getBinding("items");
            const aAllFilters = [];

            if (this._searchFilter) {
                aAllFilters.push(this._searchFilter);
            }

            if (this._activeFilters.length > 0) {
                aAllFilters.push(new Filter({
                    filters: this._activeFilters,
                    and: false
                }));
            }

            oBinding.filter(aAllFilters);
        },

        _applySorters: function () {
            const oBinding = this.byId("ordersList").getBinding("items");
            const aSorters = [];

            if (this._activeGrouper) { aSorters.push(this._activeGrouper); }
            if (this._activeSorter) { aSorters.push(this._activeSorter); }

            oBinding.sort(aSorters);
        }

    });
});