import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../redux/actions";
import selectors from "../redux/selectors";
import { Typography, Button } from "rmwc";
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

class QuizList extends Component {
    static propTypes = {
        data: PropTypes.object,
        usersOnline: PropTypes.number,
        getAllQuizzes: PropTypes.func.isRequired,
        getUsersOnline: PropTypes.func
    };

    static defaultProps = {
        data: []
    };

    constructor(props) {
        super(props);

        this.handleQuizClick = this.handleQuizClick.bind(this);
    }

    componentWillMount() {
        this.props.getAllQuizzes();
    }

    handleQuizClick({ _id, usersCount, maxUsersCount }) {
        if (usersCount >= maxUsersCount) {
            return;
        }

        this.props.history.push(`/play/${_id}`);
    }

    render() {
        const { data } = this.props;

        return (
            <div>
                <Typography use="headline4" tag="h1">
                    Quizzes
                </Typography>
                <DataTable>
                    <DataTableContent>
                        <DataTableHead>
                            <DataTableRow>
                                <DataTableHeadCell>Name</DataTableHeadCell>
                                <DataTableHeadCell alignEnd>
                                    Users
                                </DataTableHeadCell>
                            </DataTableRow>
                        </DataTableHead>
                        <DataTableBody>
                            {Object.values(data)
                                .sort((a, b) =>
                                    a.name < b.name
                                        ? -1
                                        : a.name > b.name
                                        ? 1
                                        : 0
                                )
                                .map((quiz, index) => (
                                    <DataTableRow
                                        key={index}
                                        activated={
                                            quiz.usersCount >=
                                            quiz.maxUsersCount
                                        }
                                    >
                                        <DataTableCell>
                                            {quiz.name}
                                        </DataTableCell>
                                        <DataTableCell alignEnd>
                                            <Button
                                                raised
                                                dense
                                                disabled={
                                                    quiz.usersCount >=
                                                    quiz.maxUsersCount
                                                }
                                                onClick={() =>
                                                    this.handleQuizClick(quiz)
                                                }
                                            >
                                                {quiz.usersCount}&nbsp;/&nbsp;
                                                {quiz.maxUsersCount}
                                            </Button>
                                        </DataTableCell>
                                    </DataTableRow>
                                ))}
                        </DataTableBody>
                    </DataTableContent>
                </DataTable>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    data: selectors.getAllQuizzes(state),
    usersOnline: selectors.getUsersOnline(state)
});
const mapDispatchToProps = dispatch => ({
    getAllQuizzes: () => dispatch(actions.getAllQuizzes())
});

const ConnectedQuizList = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(QuizList)
);

export default ConnectedQuizList;
