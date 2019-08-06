// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import * as Utils from 'utils/utils.jsx';

import ManageAutoResponder from 'components/user_settings/notifications/manage_auto_responder.jsx';

function getNotificationsStateFromProps(props) {
    const user = props.user;

    let autoResponderActive = false;
    let autoResponderMessage = Utils.localizeMessage(
        'user.settings.notifications.autoResponderDefault',
        'Hello, I am out of office and unable to respond to messages.'
    );

    if (user.notify_props) {
        if (user.notify_props.auto_responder_active) {
            autoResponderActive = user.notify_props.auto_responder_active === 'true';
        }

        if (user.notify_props.auto_responder_message) {
            autoResponderMessage = user.notify_props.auto_responder_message;
        }
    }
    return {

        autoResponderActive,
        autoResponderMessage,
        isSaving: false,
    };
}

export default class oooAutoResponder extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        updateSection: PropTypes.func,
        activeSection: PropTypes.string,
        closeModal: PropTypes.func.isRequired,
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
        data.auto_responder_active = this.state.autoResponderActive.toString();
        data.auto_responder_message = this.state.autoResponderMessage;

        if (!data.auto_responder_message || data.auto_responder_message === '') {
            data.auto_responder_message = Utils.localizeMessage(
                'user.settings.notifications.autoResponderDefault',
                'Hello, I am out of office and unable to respond to messages.'
            );
        }

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
                <div className='divider-dark'/>
            </div>
        );
        return (
            <div>{autoResponderSection}</div>
        );
    }
}
