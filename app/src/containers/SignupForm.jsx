import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ApplicationService from "../services/ApplicationService";
import {
    TextField,
    Button,
    Snackbar
} from 'rmwc';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: null,
            user: {
                name: "",
                password: ""
            },
            isSnackbarOpen: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
    }

    onSubmit(event) {
        const { user } = this.state;

        event.preventDefault();

        ApplicationService.register(user.name, user.password).then(() => {
            ApplicationService.login(user.name, user.password).then(() => {
                this.props.history.push("/dashboard");
                window.location.reload();
            });
        }).catch(err => {
            this.setState({
                message: err,
                isSnackbarOpen: true
            });
        });
    }

    onTextFieldChange(event) {
        let { user } = this.state;
        const field = event.target.name;
        user[field] = event.target.value;
        this.setState({
            user: user
        });
    }

    render() {
        const { user, message } = this.state;

        return (
            <form onSubmit={this.onSubmit} method="post">
                <TextField
                    fullwidth
                    placeholder={"Username"}
                    value={_.get(user, "name")}
                    onChange={this.onTextFieldChange}
                    type={"text"}
                    name={"name"}
                />
                <TextField
                    fullwidth
                    placeholder="Password"
                    value={_.get(user, "password")}
                    onChange={this.onTextFieldChange}
                    type="password"
                    name="password"
                />
                <br />
                <Button type="submit" raised theme="secondary-bg on-secondary">
                    Sign up
                </Button>
                <Snackbar
                    show={this.state.isSnackbarOpen}
                    onHide={() => this.setState({isSnackbarOpen: false})}
                    message={message}
                    actionText="Dismiss"
                />
            </form>
        );
    }
}

export default withRouter(LoginForm);
