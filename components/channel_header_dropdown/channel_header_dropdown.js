// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import {localizeMessage} from 'utils/utils';
import {ChannelHeaderDropdownItems} from 'components/channel_header_dropdown';
import Menu from 'components/widgets/menu/menu.jsx';

export default class ChannelHeaderDropdown extends React.PureComponent {
    static propTypes = {
        isReadOnly: PropTypes.bool.isRequired,
    }
    render() {
        const {
            isReadOnly,
        } = this.props;
        return (
            <Menu
                id='channelHeaderDropdownMenu'
                ariaLabel={localizeMessage('channel_header.menuAriaLabel', 'Channel Menu')}
            >
                <ChannelHeaderDropdownItems
                    isReadOnly={isReadOnly}
                    isMobile={false}
                />
            </Menu>
        );
    }
}
