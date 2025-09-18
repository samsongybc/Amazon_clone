import React, { useEffect, useState } from "react";
import classes from "./Product.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={classes.product_container}>
      {loading ? (
        <Loader />
      ) : (
        products.map((p) => <ProductCard product={p} key={p.id} />)
      )}
    </section>
  );
};

export default Product;
