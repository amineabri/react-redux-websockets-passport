import { Component } from "react";
import PropTypes from "prop-types";
import actions from "../redux/actions";
import selectors from "../redux/selectors";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ApplicationService from "../services/ApplicationService";

class Locked extends Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        setCurrentUser: PropTypes.func.isRequired
    };

    componentDidMount() {
        ApplicationService.getCurrentUser().then(response => {
            if (!response.isAuthenticated) {
                this.props.history.push("/");
            }
        });
    }

    render() {
        return this.props.isAuthenticated ? this.props.children : null;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: selectors.getIsAuthenticated(state)
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: isAuthenticated => dispatch(actions.setCurrentUser(isAuthenticated))
});

const ConnectedLocked = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Locked)
);

export default ConnectedLocked;
