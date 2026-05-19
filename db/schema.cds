namespace orders.db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Orders : cuid, managed {
    orderNo         : String(20);
    customerName    : String(100);
    orderDate       : Date;
    shippedDate     : Date;
    status          : String(20);
    totalPrice      : Decimal(15, 2);
    currency        : String(5);

    shippingAddress : Composition of one ShippingAddress
                          on shippingAddress.order = $self;

    processor       : Association to Processor;

    items           : Composition of many OrderItems
                          on items.order = $self;
}

entity ShippingAddress : cuid {
    order   : Association to Orders;
    name    : String;
    street  : String;
    zipCode : String;
    city    : String;
    region  : String;
    country : String;
}

entity Processor : cuid {
    name       : String;
    employeeId : String;
    jobTitle   : String;
    phone      : String;
    imageUrl   : String;
}

entity OrderItems : cuid {
    order       : Association to Orders;

    productName : String;
    productId   : String;

    unitPrice   : Decimal(15, 2);
    quantity    : Integer;

    total       : Decimal(15, 2);
}

entity Categories : cuid {
    categoryName : String;
    productCount : Integer;
    categoryCode : String(10);
}

entity Products : cuid {
    productName  : String;
    availability : String;
    isPromoted   : Boolean;
    productImage : String;
}

entity Products_define : cuid {
    key ID           : String;
    productName  : String;
    mainCategory : String;
    availability : String;
    isPromoted   : Boolean;
    productImage : String;
    price        : Decimal(15,2);
    currency     : String(3) default 'EUR';
    supplierName : String;
    description  : String;
    weight       : Decimal(10,2);
    measures     : String;
    // Link to category so the count (34, 7) is not random
    category     : Association to Categories;
}

entity ConfirmedOrders {

    key ID            : UUID;

    orderNumber       : String(20);

    customerName      : String(100);

    paymentType       : String(30);

    totalAmount       : Decimal(15,2);

    currency          : String(10);

    orderDate         : Timestamp;

    invoiceAddress    : String(255);

    shippingAddress   : String(255);

}

entity ConfirmedOrderItems {

    key ID            : UUID;

    order             : Association to ConfirmedOrders;

    productName       : String(120);

    quantity          : Integer;

    price             : Decimal(15,2);

    currency          : String(10);

    productImage      : String(500);

}