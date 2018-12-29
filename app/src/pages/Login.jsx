import React, { Component } from "react";
import LoginForm from "../containers/LoginForm";
import Header from "../containers/Header";
import { Theme, TopAppBarFixedAdjust, Typography } from "rmwc";

export default class Login extends Component {
    render() {
        return (
            <Theme tag="main">
                <Header />
                <TopAppBarFixedAdjust />
                <div className="page">
                    <div className="container">
                        <Typography use="headline4" tag="h1">
                            Log in
                        </Typography>
                        <LoginForm />
                    </div>
                </div>
            </Theme>
        );
    }
}
