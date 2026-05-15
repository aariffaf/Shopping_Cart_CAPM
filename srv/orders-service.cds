using {orders.db as db} from '../db/schema';
service OrdersService{
    entity Orders as projection on db.Orders;
    entity ShippingAddress as projection on db.ShippingAddress;
    entity Processor as projection on db.Processor;
    entity OrderItems as projection on db.OrderItems;
    entity Categories as projection on db.Categories;
    entity Products as projection on db.Products;
    entity Products_define as projection on db.Products_define;
}