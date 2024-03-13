import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/signup";
import UserDetails from "./components/userDetails";
import Reset from "./components/reset";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/UserDetails"}>
              Password Manager
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/Login"}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/Register"}>
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={isLoggedIn == "true" ? <UserDetails /> : <Login />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<SignUp />} />
              <Route path="/UserDetails" element={<UserDetails />} />
              <Route path="/Reset" element={<Reset />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
