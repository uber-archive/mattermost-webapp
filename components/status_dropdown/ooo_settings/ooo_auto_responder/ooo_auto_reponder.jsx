// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getUserTimezone} from 'mattermost-redux/selectors/entities/timezone';
import {getUserCurrentTimezone} from 'mattermost-redux/utils/timezone_utils';

import store from 'stores/redux_store.jsx';
import * as Utils from 'utils/utils.jsx';

import ManageAutoResponder from 'components/user_settings/notifications/manage_auto_responder.jsx';

import {getBrowserUtcOffset, getUtcOffsetForTimeZone} from '../../../../utils/timezone';
import Constants, {NotificationLevels} from '../../../../utils/constants';

function getNotificationsStateFromProps(props) {
    const user = props.user;

    const state = store.getState();
    const userId = getCurrentUserId(state);
    const userTimezone = getUserTimezone(state, userId);
    const userCurrentTimezone = getUserCurrentTimezone(userTimezone);
    const timezoneOffset = (userCurrentTimezone.length > 0 ? getUtcOffsetForTimeZone(userCurrentTimezone) : getBrowserUtcOffset()) * 60;

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
    let fromDate = '';
    let toDate = '';
    let fromTime = '';
    let toTime = '';

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
        if (autoResponderActive) {
            if (user.notify_props.fromDate) {
                fromDate = user.notify_props.fromDate;
            }
            if (user.notify_props.toDate) {
                toDate = user.notify_props.toDate;
            }
            if (user.notify_props.fromTime) {
                fromTime = user.notify_props.fromTime;
            }
            if (user.notify_props.toTime) {
                toTime = user.notify_props.toTime;
            }
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
        fromDate,
        fromTime,
        toTime,
        toDate,
        timezoneOffset,
        isSaving: false,
    };
}

export default class oooAutoResponder extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        updateSection: PropTypes.func,
        enableOutOfOfficeDatePicker: PropTypes.bool,
        enableAutoResponder: PropTypes.bool,
        theme: PropTypes.object.isRequired,
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

        data.fromDate = this.state.fromDate;
        data.fromTime = this.state.fromTime;
        data.toDate = this.state.toDate;
        data.toTime = this.state.toTime;
        data.offset = this.state.timezoneOffset.toString();

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
                    user={this.props.user}
                    isOooDatePickerEnabled={this.props.enableOutOfOfficeDatePicker}
                    isOooStatusDropdown={true}
                    autoResponderActive={this.state.autoResponderActive}
                    autoResponderMessage={this.state.autoResponderMessage}
                    updateSection={this.props.updateSection}
                    theme={this.props.theme}
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
