import { Component } from "react";
import PropTypes from "prop-types";
import actions from "../redux/actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ApplicationService from "../services/ApplicationService";

class App extends Component {

    static propTypes = {
        setCurrentUser: PropTypes.func.isRequired
    };

    componentDidMount() {
        ApplicationService.getCurrentUser().then(response => {
            this.props.setCurrentUser(response);
        });
    }

    render() {
        return this.props.children;
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: isAuthenticated => dispatch(actions.setCurrentUser(isAuthenticated))
});

const ConnectedApp = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);

export default ConnectedApp;
