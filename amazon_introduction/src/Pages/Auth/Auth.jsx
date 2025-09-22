import React, { useState } from "react";
import classes from "./Auth.module.css";
import { Link } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // console.log(email, password);

  const authHandler = async (e) => {
    e.preventDefault();
    // console.log(e.target.name);

    // auth.signInWithEmailAndPassword(email, password)
    if (e.target.name == "signin") {
      // firebase auth
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          console.log(error);
        });
    } 
    else if (e.target.name == "signup") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    }
    else {
      setError("Please enter a valid email and password");
    }
  };
  return (
    <section className={classes.login}>
      {/* Logo */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/06/Amazon_2024.svg"
          alt="Amazon Logo"
        />
      </Link>
      <div className={classes.login_container}>
        <h1>Sign In</h1>

        <form>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={classes.login_signInButton}
            type="submit"
            name="signIn"
            onClick={authHandler}
          >
            Sign In
          </button>
        </form>
        <p>
          By continuing, you agree to Amazon's <span>Conditions of Use</span>{" "}
          and <span>Privacy Notice</span>.
        </p>

        <button
          className={classes.login__registerButton}
          type="submit"
          name="signup"
          onClick={authHandler}
        >
          Create your Amazon Account
        </button>
      </div>
    </section>
  );
};

export default Auth;
