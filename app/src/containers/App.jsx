import { Component } from "react";
import PropTypes from "prop-types";
import actions from "../redux/actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class App extends Component {
    static propTypes = {
        getCurrentUser: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getCurrentUser();
    }

    render() {
        return this.props.children;
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    getCurrentUser: actions.getCurrentUser
};

const ConnectedApp = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);

export default ConnectedApp;
