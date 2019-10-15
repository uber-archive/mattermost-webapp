// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import {NotificationLevels} from 'utils/constants';

export default class UnmuteChannelButton extends React.PureComponent {
    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,

        channel: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,

        actions: PropTypes.shape({
            updateChannelNotifyProps: PropTypes.func.isRequired,
        }).isRequired,
        muted: PropTypes.bool.isRequired,
    };

    handleClick = () => {
        const {
            user,
            channel,
            actions: {
                updateChannelNotifyProps,
            },
            muted,
        } = this.props;

        updateChannelNotifyProps(user.id, channel.id, {mark_unread: muted ? NotificationLevels.ALL : NotificationLevels.MENTION});
    };

    render() {
        return (
            <button
                type='button'
                className='navbar-toggle icon icon__mute'
                onClick={this.handleClick}
            >
                <span className={this.props.muted ? 'fa fa-bell-slash-o icon' : 'fa fa-bell-o icon'}/>
            </button>
        );
    }
}
