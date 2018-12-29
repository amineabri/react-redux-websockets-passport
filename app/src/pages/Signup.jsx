import React, { Component } from "react";
import SignupForm from "../containers/SignupForm";
import Header from "../containers/Header";
import { Theme, TopAppBarFixedAdjust, Typography } from "rmwc";

export default class Signup extends Component {
    render() {
        return (
            <Theme tag="main">
                <Header />
                <TopAppBarFixedAdjust />
                <div className="page">
                    <div className="container">
                        <Typography use="headline4" tag="h1">
                            Sign up
                        </Typography>
                        <SignupForm />
                    </div>
                </div>
            </Theme>
        );
    }
}
