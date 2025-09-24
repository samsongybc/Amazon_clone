import React, { useContext, useState } from "react";
import classes from "./Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Type } from "../../Utility/action.type";
import Loader from "../../Components/Loader/Loader";
import { ClipLoader } from "react-spinners";
import { DataContext } from "../../Components/DataProvider/DataProvider";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ signin: false, signup: false });

  const [{ user }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();

  // console.log(email, password);

  const authHandler = async (e) => {
    e.preventDefault();
    // console.log(e.target.name);

    // auth.signInWithEmailAndPassword(email, password)
    if (e.target.name == "signin") {
      setLoading({ ...loading, signin: true });
      // firebase auth
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          dispatch({
            type: Type.SET_USER,
            user: userCredential.user,
          });
          setLoading({ ...loading, signin: false });
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          navigate("/");
        });
    } else if (e.target.name == "signup") {
      setLoading({ ...loading, signup: true });
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          dispatch({
            type: Type.SET_USER,
            user: userCredential.user,
          });
          setLoading({ ...loading, signup: false });
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          setLoading({ ...loading, signup: false });
        });
    } else {
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
            name="signin"
            onClick={authHandler}
          >
            {loading.signin ? <ClipLoader color="#fff" size={20} /> : "Sign In"}
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
          {loading.signup ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            "Create your Amazon Account"
          )}
        </button>
        {error && (
          <small style={{ padding: "10px", color: "red" }}>{error}</small>
        )}
      </div>
    </section>
  );
};

export default Auth;
