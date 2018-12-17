import React, { Component } from "react";
import Header from "../containers/Header";
import {
    Theme,
    TopAppBarFixedAdjust,
    Typography
} from 'rmwc';

export default class About extends Component {
    render() {
        return (
            <Theme tag="main" use="primary-bg on-primary">
                <Header />
                <TopAppBarFixedAdjust />
                <div className="page">
                    <div className="container">
                        <Typography use="headline4" tag="h1">
                            About
                        </Typography>
                        <Typography use="body1" tag="p">
                            About text here
                        </Typography>
                    </div>
                </div>
            </Theme>
        );
    }
}
