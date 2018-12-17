import React, { Component } from "react";
import QuizList from "../containers/QuizList";
import Header from "../containers/Header";
import {
    Theme,
    TopAppBarFixedAdjust
} from 'rmwc';

export default class Dashboard extends Component {
    render() {
        return (
            <Theme tag="main">
                <Header />
                <TopAppBarFixedAdjust />
                <div className="page">
                    <div className="container">
                        <QuizList />
                    </div>
                </div>
            </Theme>
        );
    }
}
