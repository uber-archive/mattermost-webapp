// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';

import TeamStore from 'stores/team_store.jsx';

import {isMobile, getWindowDimensions} from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import {getCurrentTimezone} from 'utils/timezone';

export default class PostTime extends React.PureComponent {
    static propTypes = {

        /*
         * If true, time will be rendered as a permalink to the post
         */
        isPermalink: PropTypes.bool.isRequired,

        /*
         * The time to display
         */
        eventTime: PropTypes.number.isRequired,

        /*
         * Set to display using 24 hour format
         */
        useMilitaryTime: PropTypes.bool,

        /*
         * The post id of posting being rendered
         */
        postId: PropTypes.string
    };

    static defaultProps = {
        eventTime: 0,
        useMilitaryTime: false
    };

    constructor(props) {
        super(props);

        this.state = {
            currentTeamDisplayName: TeamStore.getCurrent().name,
            ...getWindowDimensions()
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.setDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setDimensions);
    }

    setDimensions = () => {
        this.setState({
            ...getWindowDimensions()
        });
    }

    getCurrentUserTimezone = () => {
        const userId = UserStore.getCurrentId();
        const timezone = UserStore.getTimezone(userId);
        return getCurrentTimezone(timezone);
    };

    renderTimeTag() {
        const userTimezone = this.getCurrentUserTimezone();
        const date = new Date(this.props.eventTime);

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !this.props.useMilitaryTime
        };

        if (userTimezone && global.window.mm_config.EnableTimezoneSelection === 'true') {
            options.timeZone = userTimezone;
        }

        return (
            <time
                className='post__time'
                dateTime={date.toISOString()}
                title={date}
            >
                {date.toLocaleString('en', options)}
            </time>
        );
    }

    render() {
        if (isMobile() || !this.props.isPermalink) {
            return this.renderTimeTag();
        }

        return (
            <Link
                to={`/${this.state.currentTeamDisplayName}/pl/${this.props.postId}`}
                className='post__permalink'
            >
                {this.renderTimeTag()}
            </Link>
        );
    }
}
