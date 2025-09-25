import React, { useState, useEffect, useContext } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Utility/firebase";
import ProductCard from "../../Components/product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import classes from "./Orders.module.css";

const Orders = () => {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created_at", "desc")
        .get()
        .onSnapshot((snapshot) => {
          console.log(snapshot.docs.map((doc) => doc.data()));
          setOrders(snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        });
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersSnapshot = await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created_at", "desc")
        .get();

      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <LayOut>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <p>Please sign in to view your orders.</p>
        </div>
      </LayOut>
    );
  }

  if (loading) {
    return (
      <LayOut>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <div className={classes.loading}>Loading your orders...</div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={classes.orders_container}>
        <h1>Your Orders</h1>

        {orders.length === 0 ? (
          <div className={classes.no_orders}>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className={classes.orders_list}>
            {orders.map((eachOrder) => (
              <div key={eachOrder.id} className={classes.order_item}>
                <div className={classes.order_header}>
                  <div className={classes.order_info}>
                    <h3>Order ID: {eachOrder.orderId}</h3>
                    <p>
                      Order Date:{" "}
                      {new Date(eachOrder.order_date).toLocaleDateString()}
                    </p>
                    <p>
                      Status:{" "}
                      <span className={classes.status}>{eachOrder.status}</span>
                    </p>
                  </div>
                  <div className={classes.order_total}>
                    <strong>
                      Total: <CurrencyFormat amount={eachOrder.total_amount} />
                    </strong>
                  </div>
                </div>

                <div className={classes.order_items}>
                  <h4>Items Ordered:</h4>
                  <div className={classes.items_grid}>
                      {eachOrder.items.map((item, index) => (
                      <div key={index} className={classes.order_product}>
                        <img src={item.image} alt={item.title} />
                        <div className={classes.product_info}>
                          <h5>{item.title}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>
                            Price: <CurrencyFormat amount={item.price} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default Orders;
