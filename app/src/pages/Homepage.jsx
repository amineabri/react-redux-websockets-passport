import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../containers/Header";
import {
    Theme,
    TopAppBarFixedAdjust,
    Typography,
    Button
} from 'rmwc';

export default class Homepage extends Component {
    render() {
        return (
            <Theme tag="main" use="primary-bg on-primary">
                <Header />
                <TopAppBarFixedAdjust />
                <div className="page">
                    <div className="container">
                        <Typography use="headline1" tag="h1">
                            App
                        </Typography>
                        <Typography use="headline5" tag="h2">
                            React + Redux + Passport + Websockets
                        </Typography>
                        <Link to="/sign-up">
                            <Button theme="onPrimary">
                                Sign up
                            </Button>
                        </Link>
                        &nbsp;
                        <Link to="/login">
                            <Button raised theme="secondary-bg on-secondary">
                                Log in
                            </Button>
                        </Link>
                    </div>
                </div>
            </Theme>
        );
    }
}
