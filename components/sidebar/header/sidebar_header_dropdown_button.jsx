// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import MenuIcon from 'components/svg/menu_icon';
import {Constants} from 'utils/constants.jsx';
import * as Utils from 'utils/utils.jsx';

import MenuTutorialTip from 'components/tutorial/menu_tutorial_tip';

export default class SidebarHeaderDropdownButton extends React.PureComponent {
    static propTypes = {
        showTutorialTip: PropTypes.bool.isRequired,
        teamDescription: PropTypes.string.isRequired,
        teamId: PropTypes.string.isRequired,
        currentUser: PropTypes.object.isRequired,
        teamDisplayName: PropTypes.string.isRequired,
    };

    render() {
        const mainMenuToolTip = (
            <Tooltip id='main-menu__tooltip'>
                <FormattedMessage
                    id='sidebar.mainMenu'
                    defaultMessage='Main menu'
                />
            </Tooltip>
        );

        let tutorialTip = null;
        if (this.props.showTutorialTip) {
            tutorialTip = (
                <MenuTutorialTip onBottom={false}/>
            );
        }

        let teamNameWithToolTip = null;

        /*
        if (this.props.teamDescription === '') {
            teamNameWithToolTip = (
                <h1
                    id='headerTeamName'
                    className='team__name'
                >
                    {this.props.teamDisplayName}
                </h1>
            );
        } else {
        */
        var me = this.props.currentUser;
        const fullName = Utils.getFullName(me);
        teamNameWithToolTip = (
            <OverlayTrigger
                trigger={['hover', 'focus']}
                delayShow={Constants.OVERLAY_TIME_DELAY}
                placement='bottom'
                overlay={(
                    <Tooltip
                        id='full-name__tooltip'
                    >
                        {fullName}
                    </Tooltip>
                )}
                ref='descriptionOverlay'
            >
                <h1
                    id='headerTeamName'
                    className='full__name'
                >
                    {fullName}
                </h1>
            </OverlayTrigger>
        );

        // }

        return (
            <div
                className='SidebarHeaderDropdownButton'
                id='sidebarHeaderDropdownButton'
            >
                {tutorialTip}
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='right'
                    overlay={mainMenuToolTip}
                >
                    <div
                        id='headerInfo'
                        className='header__info'
                    >
                        {teamNameWithToolTip}
                        <div
                            id='headerUsername'
                            className='user__name'
                        >
                            {'@' + this.props.currentUser.username}
                        </div>
                        <MenuIcon className='sidebar-header-dropdown__icon'/>
                    </div>
                </OverlayTrigger>
            </div>
        );
    }
}
