import React, { useContext, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { useNavigate } from "react-router-dom";
import classes from "./Payments.module.css";
import { Type } from "../../Utility/action.type";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SAAAS4YhsXcH5Bt6TMqDQXVkAqJd5tkhaWk483mYW5iSt0mKf7VYqmXjng9sWitMj8Rxob4VtHWNmyhsIcarLGI00MtSAx9BI"
);

// Payment Form Component (must be inside Elements provider)
const PaymentForm = ({ totalAmount, onPaymentSuccess }) => {
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      // Simulate successful payment
      setTimeout(() => {
        setProcessing(false);
        onPaymentSuccess();
      }, 2000);
    } catch (error) {
      setCardError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className={classes.payment_form}>
      <h2>Payment Information</h2>
      <div className={classes.payment_methods}>
        <h3>Payment Methods</h3>
        <div className={classes.payment_card_container}>
          <div className={classes.payment_details}>
            <form onSubmit={handlePayment}>
              {cardError && (
                <div className={classes.card_error}>
                  <small style={{ color: "red" }}>{cardError}</small>
                </div>
              )}

              <div className={classes.card_fields_container}>
                <div className={classes.card_field_label}>
                  <label>Card Information</label>
                </div>
                <div className={classes.card_input_container}>
                  <CardElement
                    onChange={handleChange}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          fontFamily: "Arial, sans-serif",
                          lineHeight: "20px",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                        complete: {
                          color: "#4caf50",
                        },
                      },
                      hidePostalCode: true,
                    }}
                  />
                </div>
                <div className={classes.card_help_text}>
                  <small>
                    Enter your 16-digit card number, expiry date (MM/YY), and
                    CVC
                  </small>
                </div>
              </div>

              <div className={classes.payment_price}>
                <div className={classes.total_display}>
                  <span>
                    Total Order: <CurrencyFormat amount={totalAmount} />
                  </span>
                </div>

                <button
                  type="submit"
                  className={classes.pay_now_button}
                  disabled={!stripe || processing}
                >
                  {processing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <span>
                      Pay Now - <CurrencyFormat amount={totalAmount} />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payments = () => {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();

  const totalAmount = basket.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const totalItems = basket.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handlePlaceOrder = async () => {
    if (basket.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!user) {
      alert("Please sign in to place an order!");
      navigate("/auth");
      return;
    }

    try {
      alert(`Order placed successfully! Total: $${totalAmount.toFixed(2)}`);

      // Clear the cart after successful order
      basket.forEach((item) => {
        dispatch({
          type: Type.REMOVE_FROM_BASKET,
          id: item.id,
        });
      });

      navigate("/orders");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <LayOut>
      <div className={classes.payments_container}>
        <div className={classes.payments_header}>
          <h1>Payment & Checkout ({totalItems} items)</h1>
          <button className={classes.back_button} onClick={handleBackToCart}>
            ← Back to Cart
          </button>
        </div>

        <section className={classes.payment_address}>
          <div className={classes.delivery_address_header}>
            Delivery Address
          </div>
          <div className={classes.delivery_address_details}>
            <div>{user?.email || "Please sign in"}</div>
            <div>111111 adis street</div>
            <div>silver spring, md 20901</div>
          </div>
        </section>

        <div className={classes.payments_content}>
          <div className={classes.order_summary}>
            <h2>Order Summary</h2>
            <div className={classes.summary_items}>
              {basket.map((item) => (
                <div key={item.id} className={classes.summary_item}>
                  <img src={item.image} alt={item.title} />
                  <div className={classes.item_details}>
                    <h4>{item.title}</h4>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p>
                      Price: <CurrencyFormat amount={item.price} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.total_section}>
              <div className={classes.total_line}>
                <span>Items ({totalItems}):</span>
                <span>
                  <CurrencyFormat amount={totalAmount} />
                </span>
              </div>
              <div className={classes.total_line}>
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className={classes.total_line_total}>
                <span>Total:</span>
                <span>
                  <CurrencyFormat amount={totalAmount} />
                </span>
              </div>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <PaymentForm
              totalAmount={totalAmount}
              onPaymentSuccess={handlePlaceOrder}
            />
          </Elements>
        </div>
      </div>
    </LayOut>
  );
};

export default Payments;
