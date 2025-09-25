import React, { useContext, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { useNavigate } from "react-router-dom";
import classes from "./Payments.module.css";
import { Type } from "../../Utility/action.type";
import axiosInstance from "../../API/axios";
import { loadStripe } from "@stripe/stripe-js";
import { db } from "../../Utility/firebase";
import firebase from "firebase/compat/app";
// import {ClipLoader} from "react-spinners";

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
const PaymentForm = ({ totalAmount, onPaymentSuccess, dispatch }) => {
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

      // Create payment intent using axios
      const paymentData = {
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: "usd",
        payment_method_id: paymentMethod.id,
        description: `Payment for ${totalAmount} order`,
      };

      const response = await axiosInstance.post(
        `/payments/create?total=${Math.round(totalAmount * 100)}`,
        paymentData
      );

      if (response.data.clientSecret) {
        const { clientSecret, status } = response.data;

        if (status === "requires_action") {
          // Handle 3D Secure or other authentication
          const { error: confirmError } = await stripe.confirmCardPayment(
            clientSecret
          );

          if (confirmError) {
            setCardError(confirmError.message);
            setProcessing(false);
            return;
          }
        } else if (status === "succeeded") {
          // Payment already succeeded
          console.log("Payment succeeded!");
        }

        // Payment successful - process the order
        setProcessing(false);

        // Empty the basket after successful payment
        dispatch({
          type: Type.EMPTY_BASKET,
        });

        onPaymentSuccess();
      } else {
        setCardError(response.data.message || "Payment processing failed");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError(
        error.response?.data?.message || "Payment failed. Please try again."
      );
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
      // Create order data with timestamp
      const orderTimestamp = new Date();
      const orderId = `order_${user.uid}_${orderTimestamp.getTime()}`;

      const orderData = {
        orderId: orderId,
        user_id: user.uid,
        user_email: user.email,
        items: basket.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        total_amount: totalAmount,
        order_date: orderTimestamp.toISOString(),
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        status: "completed",
      };

      // Save order to Firebase Firestore
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(orderId)
        .set(orderData);

      // Also save to a global orders collection for admin purposes
      await db.collection("orders").doc(orderId).set(orderData);

      console.log("Order saved to Firebase successfully");

      // Optionally, also save to backend using axios (for additional processing)
      try {
        const response = await axiosInstance.post("/orders/create", orderData);
        console.log("Order also saved to backend:", response.data);
      } catch (axiosError) {
        console.warn(
          "Backend save failed, but Firebase save succeeded:",
          axiosError
        );
      }

      alert(`Order placed successfully! Order ID: ${orderId}`);

      // Clear the cart after successful order
      basket.forEach((item) => {
        dispatch({
          type: Type.REMOVE_FROM_BASKET,
          id: item.id,
        });
      });

      navigate("/orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
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
              dispatch={dispatch}
            />
          </Elements>
        </div>
      </div>
    </LayOut>
  );
};

export default Payments;
