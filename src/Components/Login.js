import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import "./style/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { fetchUserInfo, loginUser, LOGIN_SUCCESS } from "../actions";
import { auth } from "../Firebase/firebase_Config";
toast.configure();
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeclose = <FontAwesomeIcon icon={faEyeSlash} />;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => {
    return state.reducer.isAuthenticated;
  });
  const loginError = useSelector((state) => {
    return state.reducer.loginError;
  });
  const currentUser = useSelector((state) => {
    return state.reducer.user;
  });

  useEffect(() => {
    let get_idToken = localStorage.getItem("User_id_token");
    if (get_idToken) {
      auth.onIdTokenChanged((user) => {
        dispatch({
          type: LOGIN_SUCCESS,
          user,
        });
      });
    }
  });

  const LoginUser = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(currentUser);

    dispatch(loginUser(email, password));
    // if (auth.currentUser.emailVerified) {
    // } else {
    //   toast.dark("please verified your email!", { autoClose: 4000 });
    // }

    setPassword("");
    setEmail("");
    setLoading(false);
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <>
        <div className="Head">
          <p>Shopify Sellers</p>
        </div>
        <Card className="login-card">
          {loginError ? <Alert color="danger">failed to login</Alert> : null}
          <CardHeader>
            <h2>Login</h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={LoginUser}>
              <FormGroup>
                <Label>Enter Email :</Label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Password :</Label>
                <a style={{ float: "right" }} type="button">
                  <Link to="/resetpassword">Forget Password </Link>
                </a>
                <div className="password-div">
                  <Input
                    type={passwordShown ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i onClick={togglePasswordVisiblity}>
                    {passwordShown === false ? eye : eyeclose}
                  </i>
                </div>
              </FormGroup>
              <button className="login-btn" type="submit" disabled={loading}>
                Login
                <span>
                  <FontAwesomeIcon icon={faUnlock} />
                </span>
              </button>
            </Form>
          </CardBody>
        </Card>
        <div className="Create-Account-Link">
          Don't Have An Account ?{" "}
          <a type="button" disabled={loading}>
            <Link to="/signup">Create Account</Link>
          </a>
        </div>
      </>
    );
  }
}

export default Login;
