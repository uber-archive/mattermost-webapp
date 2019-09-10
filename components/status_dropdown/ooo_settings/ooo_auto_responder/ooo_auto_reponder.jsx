// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import * as Utils from 'utils/utils.jsx';

import ManageAutoResponder from 'components/user_settings/notifications/manage_auto_responder.jsx';
import Constants, {NotificationLevels} from '../../../../utils/constants';

function getNotificationsStateFromProps(props) {
    const user = props.user;

    let desktop = NotificationLevels.MENTION;
    let sound = 'true';
    let comments = 'never';
    let enableEmail = 'true';
    let pushActivity = NotificationLevels.MENTION;
    let pushStatus = Constants.UserStatuses.AWAY;
    let autoResponderActive = false;
    let autoResponderMessage = Utils.localizeMessage(
        'user.settings.notifications.autoResponderDefault',
        'Hello, I am out of office and unable to respond to messages.'
    );

    if (user.notify_props) {
        if (user.notify_props.desktop) {
            desktop = user.notify_props.desktop;
        }
        if (user.notify_props.desktop_sound) {
            sound = user.notify_props.desktop_sound;
        }
        if (user.notify_props.comments) {
            comments = user.notify_props.comments;
        }
        if (user.notify_props.email) {
            enableEmail = user.notify_props.email;
        }
        if (user.notify_props.push) {
            pushActivity = user.notify_props.push;
        }
        if (user.notify_props.push_status) {
            pushStatus = user.notify_props.push_status;
        }

        if (user.notify_props.auto_responder_active) {
            autoResponderActive = user.notify_props.auto_responder_active === 'true';
        }

        if (user.notify_props.auto_responder_message) {
            autoResponderMessage = user.notify_props.auto_responder_message;
        }
    }

    let usernameKey = false;
    let customKeys = '';
    let firstNameKey = false;
    let channelKey = false;

    if (user.notify_props) {
        if (user.notify_props.mention_keys) {
            const keys = user.notify_props.mention_keys.split(',');

            if (keys.indexOf(user.username) === -1) {
                usernameKey = false;
            } else {
                usernameKey = true;
                keys.splice(keys.indexOf(user.username), 1);
                if (keys.indexOf(`@${user.username}`) !== -1) {
                    keys.splice(keys.indexOf(`@${user.username}`), 1);
                }
            }

            customKeys = keys.join(',');
        }

        if (user.notify_props.first_name) {
            firstNameKey = user.notify_props.first_name === 'true';
        }

        if (user.notify_props.channel) {
            channelKey = user.notify_props.channel === 'true';
        }
    }

    return {
        desktopActivity: desktop,
        enableEmail,
        pushActivity,
        pushStatus,
        desktopSound: sound,
        usernameKey,
        customKeys,
        customKeysChecked: customKeys.length > 0,
        firstNameKey,
        channelKey,
        autoResponderActive,
        autoResponderMessage,
        notifyCommentsLevel: comments,
        isSaving: false,
    };
}

export default class oooAutoResponder extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        updateSection: PropTypes.func,
        enableAutoResponder: PropTypes.bool,
        actions: PropTypes.shape({
            updateMe: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        user: null,
        activeSection: '',
    }

    constructor(props) {
        super(props);

        this.state = getNotificationsStateFromProps(props);
    }

    handleSubmit = () => {
        const data = {};
        data.email = this.state.enableEmail;
        data.desktop_sound = this.state.desktopSound;
        data.desktop = this.state.desktopActivity;
        data.push = this.state.pushActivity;
        data.push_status = this.state.pushStatus;
        data.comments = this.state.notifyCommentsLevel;
        data.auto_responder_active = this.state.autoResponderActive.toString();
        data.auto_responder_message = this.state.autoResponderMessage;

        if (!data.auto_responder_message || data.auto_responder_message === '') {
            data.auto_responder_message = Utils.localizeMessage(
                'user.settings.notifications.autoResponderDefault',
                'Hello, I am out of office and unable to respond to messages.'
            );
        }

        const mentionKeys = [];
        if (this.state.usernameKey) {
            mentionKeys.push(this.props.user.username);
        }

        let stringKeys = mentionKeys.join(',');
        if (this.state.customKeys.length > 0 && this.state.customKeysChecked) {
            stringKeys += ',' + this.state.customKeys;
        }

        data.mention_keys = stringKeys;
        data.first_name = this.state.firstNameKey.toString();
        data.channel = this.state.channelKey.toString();

        this.setState({isSaving: true});

        this.props.actions.updateMe({notify_props: data}).
            then(({data: result, error: err}) => {
                if (result) {
                    this.setState(getNotificationsStateFromProps(this.props));
                    this.updateSection('');
                } else if (err) {
                    this.setState({serverError: err.message, isSaving: false});
                }
            });
    }

    handleCancel = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.setState(getNotificationsStateFromProps(this.props));
    }

    handleUpdateSection = (section) => {
        if (section) {
            this.props.updateSection(section);
        } else {
            this.props.updateSection('');
            this.handleCancel();
        }
    };

    setStateValue = (key, value) => {
        const data = {};
        data[key] = value;
        this.setState(data);
    }

    updateSection = (section) => {
        this.setState({isSaving: false});
        this.props.updateSection(section);
    }

    render() {
        const autoResponderSection = (
            <div>
                <ManageAutoResponder
                    isOooStatusDropdown={true}
                    autoResponderActive={true}
                    autoResponderMessage={this.state.autoResponderMessage}
                    updateSection={this.props.updateSection}
                    setParentState={this.setStateValue}
                    submit={this.handleSubmit}
                    error={this.state.serverError}
                    saving={this.state.isSaving}
                />
            </div>
        );
        return (
            <div>{autoResponderSection}</div>
        );
    }
}
