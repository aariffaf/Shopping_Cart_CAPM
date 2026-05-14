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
