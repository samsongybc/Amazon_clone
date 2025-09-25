import React, { useContext } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { Type } from "../../Utility/action.type";
import { Link, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import classes from "./Cart.module.css";

const Cart = () => {
  const [{ basket }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  
  console.log("🛒 Cart loaded with items:", basket.length);
  console.log("📦 Cart items:", basket);

  const removeFromCart = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id: id,
    });
  };

  const incrementItem = (id) => {
    dispatch({
      type: Type.INCREMENT_ITEM,
      id: id,
    });
  };

  const handleCheckout = () => {
    if (basket.length === 0) {
      alert("Your cart is empty! Add some items before proceeding to checkout.");
      return;
    }
    
    console.log("💳 Proceeding to checkout with items:", basket.length);
    navigate("/payments");
  };

  return (
    <LayOut>
      <div className={classes.cart_container}>
        <div className={classes.cart_left}>
          <h2>Shopping Cart</h2>
          {basket.length === 0 ? (
            <div className={classes.empty_cart}>
              <h3>Your cart is empty</h3>
              <p>Add some items to get started!</p>
            </div>
          ) : (
            basket.map((item, index) => {
              console.log(`🛍️ Rendering cart item ${index + 1}:`, item.title);
              return (
                <div key={item.id} className={classes.cart_item}>
                  <div className={classes.item_image_container}>
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} className={classes.cart_item_image} />
                    </Link>
                  </div>
                  
                  <div className={classes.item_details}>
                    <div className={classes.item_header}>
                      <Link to={`/product/${item.id}`} className={classes.item_title_link}>
                        <h3 className={classes.item_title}>{item.title}</h3>
                      </Link>
                      <div className={classes.item_category}>
                        {item.category && (
                          <span className={classes.category_badge}>
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={classes.item_rating}>
                      {item.rating && (
                        <>
                          <Rating 
                            value={item.rating.rate || 0} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                          />
                          <span className={classes.rating_count}>
                            ({item.rating.count || 0} reviews)
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className={classes.price_section}>
                      <div className={classes.unit_price}>
                        <span className={classes.price_label}>Price: </span>
                        <CurrencyFormat amount={item.price} />
                      </div>
                    </div>

                    <div className={classes.quantity_controls}>
                      <span className={classes.quantity_label}>Quantity:</span>
                      <div className={classes.quantity_buttons}>
                        <button
                          onClick={() => {
                            console.log("➖ Decrementing item:", item.title);
                            decrementItem(item.id);
                          }}
                          className={classes.quantity_button}
                          disabled={item.quantity <= 1}
                          title="Decrease quantity"
                        >
                          ➖
                        </button>
                        <span className={classes.quantity_display}>
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => {
                            console.log("➕ Incrementing item:", item.title);
                            incrementItem(item.id);
                          }}
                          className={classes.quantity_button}
                          title="Increase quantity"
                        >
                          ➕
                        </button>
                      </div>
                    </div>

                    <div className={classes.item_total}>
                      <div className={classes.total_calculation}>
                        <span className={classes.calculation_text}>
                          <CurrencyFormat amount={item.price} /> × {item.quantity || 1} = 
                        </span>
                        <strong className={classes.total_amount}>
                          <CurrencyFormat
                            amount={item.price * (item.quantity || 1)}
                          />
                        </strong>
                      </div>
                    </div>
                    
                    <div className={classes.item_actions}>
                      <button
                        onClick={() => {
                          console.log("🗑️ Removing item from cart:", item.title);
                          removeFromCart(item.id);
                        }}
                        className={classes.remove_button}
                        title="Remove this item from cart"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {basket.length > 0 && (
          <div className={classes.cart_right}>
            <div className={classes.subtotal}>
              <h3>
                Subtotal (
                {basket.reduce(
                  (total, item) => total + (item.quantity || 1),
                  0
                )}{" "}
                items):
              </h3>
              <CurrencyFormat
                amount={basket.reduce(
                  (total, item) => total + item.price * (item.quantity || 1),
                  0
                )}
              />
            </div>
            <button 
              className={classes.checkout_button}
              onClick={handleCheckout}
            >
              Pay Now
            </button>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default Cart;
