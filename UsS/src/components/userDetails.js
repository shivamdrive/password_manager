import React, { Component } from "react";
const CryptoJS = require("crypto-js");

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStuff: false,
      userData: [],
      applicationName: "",
      userName: "",
      applicationPassword: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { applicationName, userName, applicationPassword } = this.state;
    console.log(applicationName, userName, applicationPassword);
    fetch("http://localhost:3000/userData", {
      method: "POST",
      croosDomain: true,
      headers: {
        "Content-Type": "application/json",
        Appect: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        applicationName,
        userName,
        applicationPassword,
      }),
    })
      .then((res) => res.json())
      .then((data, decryptedText) => {
        // console.log(data, "userData from jatin");
        this.setState({ userData: data["userObj"]["webData"] }, () => {
          console.log(this.state);
          // console.log("DecryptedPassword:", this.decryptedText);
        });
      });
  }

  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };
  securePass = (pass) => {
    var decrypted = CryptoJS.AES.decrypt(
      pass,
      "dgfdsgdfftdgdg345678[]asfsdfsv"
    );
    var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    // console.log(decryptedText, "This is deebug");
    return decryptedText;
  };

  handleClick = () => {
    this.setState({ showStuff: !this.state.showStuff });
  };
  render() {
    const itemElements = this.state.userData.map((item, index) => {
      return (
        <div>
          <p>Application Name: {item.applicationName}</p>
          {/* <p>{item.applicationName}</p> */}
          <p> UserName: {item.userName}</p>
          {/* <h3>{item.userName}</h3> */}
          <p> Password: {this.securePass(item.applicationPassword)}</p>
          {/* <h3>{item.applicationPassword}</h3> */}
          <hr></hr>
        </div>
      );
    });
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <h1> Welcome : {this.state.userData.fname} </h1>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  {/* <h1> {this.state.userData.fname} </h1> */}
                </li>
                <li className="nav-item"></li>
              </ul>
            </div>
          </div>
        </nav>
        <form onSubmit={this.handleSubmit}>
          <h3>User Details</h3>
          <div className="mb-3">
            <label>Application Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Application Name"
              onChange={(e) =>
                this.setState({ applicationName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label>User Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Website name"
              onChange={(e) => this.setState({ userName: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              onChange={(e) =>
                this.setState({ applicationPassword: e.target.value })
              }
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <br />
          <button onClick={this.logOut} className="btn btn-primary">
            Log Out
          </button>
        </form>
        <div>
          <button onClick={this.handleClick} className="btn btn-primary">
            Show/Hide Saved Password
          </button>
          {this.state.showStuff ? itemElements : null}
        </div>

        {/* <div className="container"> {itemElements}</div> */}
      </div>
    );
  }
}
