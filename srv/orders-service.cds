using {orders.db as db} from '../db/schema';
service OrdersService{
    entity Orders as projection on db.Orders;
    entity ShippingAddress as projection on db.ShippingAddress;
    entity Processor as projection on db.Processor;
    entity OrderItems as projection on db.OrderItems;
}