// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

export default class LocalDateTime extends React.PureComponent {
    static propTypes = {

        /*
         * The time to display
         */
        eventTime: PropTypes.number,

        /*
         * Set to display using 24 hour format
         */
        useMilitaryTime: PropTypes.bool,

        /*
         * Current timezone of the user
         */
        timezone: PropTypes.string,
    };

    render() {
        const {
            eventTime,
            timezone,
            useMilitaryTime,
        } = this.props;

        const date = eventTime ? new Date(eventTime) : new Date();

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !useMilitaryTime,
        };

        if (timezone) {
            options.timeZone = timezone;
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
}
