import React from 'react'
import {connect} from "react-redux";
import * as actions from "../../store/actions";

import AuthorQueryResult from './AuthorQueryResult'
import {withStyles} from "material-ui/styles/index";
import axios from "axios/index";
import serverConfig from "../../serverConfig";
import {CircularProgress} from 'material-ui/Progress';

import InfiniteScroll from 'react-infinite-scroller';
import purple from 'material-ui/colors/purple';

const styles = theme => ({
    list: {
        height: '84vh',
        overflow: 'auto',
        marginTop: '5px',
        width: '100%',
    },
    initializeProgress: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%) translateX(-50%)',
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

class AuthorQueryResults extends React.Component {
    state = {};



    componentDidMount() {
        if (this.props.authors.length===0)
        this.props.searchAuthor();
    }

    loadNext() {
        this.props.onNextAuthorLoad();
        let onConcatAuthors = this.props.onConcatAuthors;
        let auth = {headers: {Authorization: 'bearer ' + this.props.JWT}};
        axios.post(serverConfig.backendUrl + 'search', this.props.currentAuthorSearch, auth)
            .then(function (response) {
                onConcatAuthors(response.data.result);
            })
    }

    render() {
        const {classes, authors} = this.props;
        return (<div>
                {authors.length === 0 && this.props.authorsHasMore ?
                    (<div key={0}><CircularProgress className={classes.initializeProgress} size={100} thickness={2}
                                                    style={{color: purple[500]}}/></div>) :
                    (<div className={classes.list}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadNext.bind(this)}
                            hasMore={this.props.authorsHasMore}
                            useWindow={false}
                            loader={<div key={0}><CircularProgress className={classes.progress} size={100}
                                                                   thickness={2}/></div>}>
                            {this.props.authors.map(author => {
                                return <AuthorQueryResult
                                    key={author.RN}
                                    author={author}
                                />
                            })}
                        </InfiniteScroll>
                    </div>)}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        authors: state.authors,
        authorsHasMore: state.authorsHasMore,
        currentAuthorSearch: state.currentAuthorSearch,
        JWT: state.JWT,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onNextAuthorLoad: () => dispatch({type: actions.NEXTAUTHORLOAD}),
        onConcatAuthors: (authors) => dispatch({type: actions.CONCATAUTHORS, authors: authors})
    };
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AuthorQueryResults))