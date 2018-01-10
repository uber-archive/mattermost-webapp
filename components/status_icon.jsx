// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import StatusAwayIcon from 'components/svg/status_away_icon';
import StatusDndIcon from 'components/svg/status_dnd_icon';
import StatusOfflineIcon from 'components/svg/status_offline_icon';
import StatusOnlineIcon from 'components/svg/status_online_icon';

export default class StatusIcon extends React.PureComponent {
    static propTypes = {
        status: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.string,
    };

    static defaultProps = {
        className: '',
    };

    render() {
        const {status, type} = this.props;

        if (!status) {
            return null;
        }

        const className = 'status ' + this.props.className;

        let IconComponent = 'span';
        let statusIcon = '';
        if (type === 'avatar') {
            if (status === 'online') {
                statusIcon = <i className='uchat-icons-person_online online--icon'/>;
            } else if (status === 'away') {
                statusIcon = <i className='uchat-icons-person_away away--icon'/>;
            } else if (status === 'dnd') {
                statusIcon = <i className='uchat-icons-person_dnd away--icon'/>;
            } else {
                statusIcon = <i className='uchat-icons-person_offline'/>;
            }

            return (
                <span className={className}>
                    {statusIcon}
                </span>
            );
        } else if (status === 'online') {
            IconComponent = StatusOnlineIcon;
        } else if (status === 'away') {
            IconComponent = StatusAwayIcon;
        } else if (status === 'dnd') {
            IconComponent = StatusDndIcon;
        } else {
            IconComponent = StatusOfflineIcon;
        }

        return <IconComponent className={className}/>;
    }
}
