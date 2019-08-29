// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {UserStatuses, ModalIdentifiers} from 'utils/constants.jsx';
import {localizeMessage} from 'utils/utils.jsx';
import ResetStatusModal from 'components/reset_status_modal';
import StatusIcon from 'components/status_icon.jsx';

import Menu from 'components/widgets/menu/menu';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';
import MenuGroup from 'components/widgets/menu/menu_group';
import MenuItemAction from 'components/widgets/menu/menu_items/menu_item_action';

import * as Utils from '../../utils/utils';
import Constants from '../../utils/constants';

import AutoResponderModal from '../status_dropdown/ooo_settings/modal';

export default class StatusDropdown extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        status: PropTypes.string,
        updateSection: PropTypes.func,
        userId: PropTypes.string.isRequired,
        profilePicture: PropTypes.string,
        autoResetPref: PropTypes.string,
        showOutOfOfficeInStatusDropdown: PropTypes.bool.isRequired,
        enableAutoResponder: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            openModal: PropTypes.func.isRequired,
            setStatus: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        userId: '',
        profilePicture: '',
        status: UserStatuses.OFFLINE,
    }

    constructor(props) {
        super(props);
        const message = Utils.localizeMessage(
            'user.settings.notifications.autoResponderDefault',
            'Hello, I am out of office and unable to respond to messages.'
        );

        this.state = {
            autoResponderActive: false,
            autoResponderMessage: message,
            pushStatus: Constants.UserStatuses.AWAY,
            isSaving: false,
        };
        this.setOutOfOffice = this.setOutOfOffice.bind(this);
    }

    isUserOutOfOffice = () => {
        return this.props.status === UserStatuses.OUT_OF_OFFICE;
    };

    setStatus = (status) => {
        this.props.actions.setStatus({
            user_id: this.props.userId,
            status,
        });
    };

    setOnline = (event) => {
        event.preventDefault();
        this.setStatus(UserStatuses.ONLINE);
    };

    setOffline = (event) => {
        event.preventDefault();
        this.setStatus(UserStatuses.OFFLINE);
    };

    setAway = (event) => {
        event.preventDefault();
        this.setStatus(UserStatuses.AWAY);
    };

    setDnd = (event) => {
        event.preventDefault();
        this.setStatus(UserStatuses.DND);
    };

    setOutOfOffice = () => {
        event.preventDefault();
        const oooStatusModal = {
            ModalId: ModalIdentifiers.STATUS_DROPDOWN,
            dialogType: AutoResponderModal,
        };
        this.props.actions.openModal(oooStatusModal);
    };

    showStatusChangeConfirmation = (status) => {
        const resetStatusModalData = {
            ModalId: ModalIdentifiers.RESET_STATUS,
            dialogType: ResetStatusModal,
            dialogProps: {newStatus: status},
        };
        this.props.actions.openModal(resetStatusModalData);
    };

    renderProfilePicture = () => {
        if (!this.props.profilePicture) {
            return null;
        }
        return (
            <img
                className='user__picture'
                src={this.props.profilePicture}
            />
        );
    };

    renderDropdownIcon = () => {
        return (
            <FormattedMessage
                id='generic_icons.dropdown'
                defaultMessage='Dropdown Icon'
            >
                { (title) => (
                    <i
                        className={'fa fa-caret-down'}
                        title={title}
                    />)
                }
            </FormattedMessage>
        );
    };

    updateSection = (section) => {
        this.setState({isSaving: false});
        // eslint-disable-next-line react/prop-types
        this.props.updateSection(section);
    };

    render() {
        const needsConfirm = this.isUserOutOfOffice() && this.props.autoResetPref === '';
        const profilePicture = this.renderProfilePicture();
        const dropdownIcon = this.renderDropdownIcon();

        // eslint-disable-next-line max-statements-per-line
        const setOnline = needsConfirm ? () => this.showStatusChangeConfirmation('online') : this.setOnline;
        const setDnd = needsConfirm ? () => this.showStatusChangeConfirmation('dnd') : this.setDnd;
        const setAway = needsConfirm ? () => this.showStatusChangeConfirmation('away') : this.setAway;
        const setOffline = needsConfirm ? () => this.showStatusChangeConfirmation('offline') : this.setOffline;
        const setOutOfOffice = needsConfirm ? () => null : this.setOutOfOffice;

        return (
            <MenuWrapper
                onToggle={this.onToggle}
                style={this.props.style}
            >
                <div className='status-wrapper status-selector'>
                    {profilePicture}
                    <StatusIcon status={this.props.status}/>
                    <span className={'status status-edit edit'}>
                        {dropdownIcon}
                    </span>
                </div>
                <Menu ariaLabel={localizeMessage('status_dropdown.menuAriaLabel', 'Change Status Menu')}>
                    <MenuGroup>
                        <MenuItemAction
                            show={this.isUserOutOfOffice()}
                            onClick={() => null}
                            text={localizeMessage('status_dropdown.set_ooo', 'Out of office')}
                            extraText={localizeMessage('status_dropdown.set_ooo.extra', 'Automatic Replies are enabled')}
                        />
                    </MenuGroup>

                    <MenuGroup>
                        <MenuItemAction
                            onClick={setOnline}
                            text={localizeMessage('status_dropdown.set_online', 'Online')}
                        />
                        <MenuItemAction
                            onClick={setAway}
                            text={localizeMessage('status_dropdown.set_away', 'Away')}
                        />
                        <MenuItemAction
                            onClick={setDnd}
                            text={localizeMessage('status_dropdown.set_dnd', 'Do not disturb')}
                            extraText={localizeMessage('status_dropdown.set_dnd.extra', 'Disables Desktop and Push Notifications')}
                        />
                        <MenuItemAction
                            show={this.props.showOutOfOfficeInStatusDropdown && this.props.enableAutoResponder && !this.isUserOutOfOffice()}
                            onClick={setOutOfOffice}
                            text={localizeMessage('status_dropdown.set_ooo', 'Out of office')}

                            extraText={localizeMessage('status_dropdown.disabled_ooo.extra', 'Automatic Replies are disabled')}
                        />
                        <MenuItemAction
                            onClick={setOffline}
                            text={localizeMessage('status_dropdown.set_offline', 'Offline')}
                        />
                    </MenuGroup>
                </Menu>
            </MenuWrapper>
        );
    }
}
