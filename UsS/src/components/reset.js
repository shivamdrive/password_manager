import React, { Component } from "react";

export default class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email } = this.state;
    console.log(email);
    fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Appect: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "UserRegister_Reset");
        alert(data.status);
        // if (data.status == "User Successfully registered") {
        //   alert("User Successfully registered, Please Login");
        //   window.location.href = "./login"; //redirect to login page
        // }
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Forgot Password</h3>

        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email Address"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          {/* Already registered <a href="/Login">sign in?</a> */}
          <a href="/sign-up"> Sign up </a>
        </p>
      </form>
    );
  }
}
