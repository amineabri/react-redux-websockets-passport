import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../redux/actions";
import selectors from "../redux/selectors";
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from "@rmwc/data-table";
import "@rmwc/data-table/data-table.css";

class Leaderboard extends Component {
    static propTypes = {
        data: PropTypes.array,
        getLeaderboard: PropTypes.func.isRequired
    };

    static defaultProps = {
        data: []
    };

    componentWillMount() {
        this.props.getLeaderboard();
    }

    render() {
        const { data } = this.props;

        return (
            <DataTable>
                <DataTableContent>
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableHeadCell>User</DataTableHeadCell>
                            <DataTableHeadCell alignEnd>
                                Points
                            </DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {data.map((user, index) => (
                            <DataTableRow key={index}>
                                <DataTableCell>{user.name}</DataTableCell>
                                <DataTableCell alignEnd>
                                    {user.total_points}
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
        );
    }
}

const mapStateToProps = state => ({
    data: selectors.getLeaderboard(state)
});

const mapDispatchToProps = dispatch => ({
    getLeaderboard: () => dispatch(actions.getLeaderboard())
});

const ConnectedLeaderboard = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Leaderboard)
);

export default ConnectedLeaderboard;
