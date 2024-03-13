import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    console.log(email, password);
    fetch("http://localhost:3000/login-user", {
      method: "POST",
      croosDomain: true,
      headers: {
        "Content-Type": "application/json",
        Appect: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegistered");
        if (data.status == "ok") {
          alert("Login Successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          window.location.href = "./userDetails"; //redirect to userDetails page
        }
        if (data.status == "errorInvalidPassword") {
          alert("Invalid Password");
        }
        if (data.status == "User not found") {
          alert("Invalid User, Please Register");
        }
      });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Log In</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          Forgot <a href="/Reset">password?</a>
        </p>
      </form>
    );
  }
}
