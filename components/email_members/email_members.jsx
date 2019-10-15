// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

export default class EmailMembers extends React.Component {
    static propTypes = {
        config: PropTypes.object.isRequired,
        channelId: PropTypes.string,
        actions: PropTypes.shape({
            getChannelMembersEmails: PropTypes.func.isRequired,
        }).isRequired,
    };

    handleEmailChannelMembers = () => {
        this.props.actions.getChannelMembersEmails(this.props.channelId).then((data) => {
            window.location.href = 'mailto:' + data.data;
        });
    };

    render() {
        if (this.props.config.EnableEmailSendInChannel !== 'true') {
            return (<div/>);
        }
        const icon = 'M';
        const emailMembersTooltip = (
            <Tooltip id='emailMembersTooltip'>
                <FormattedMessage
                    id='channel_header.emailMembers'
                    defaultMessage='Email Members'
                />
            </Tooltip>
        );
        return (
            <div
                id='channelMemberEmails'
                className={'channel-header__icon'}
            >
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement='bottom'
                    overlay={emailMembersTooltip}
                >
                    <div
                        id='member_email'
                        onClick={this.handleEmailChannelMembers}
                    >
                        {icon}
                    </div>
                </OverlayTrigger>
            </div>
        );
    }
}
