// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';

import AutosizeTextarea from 'components/autosize_textarea.jsx';
import SettingItemMax from 'components/setting_item_max.jsx';
import {localizeMessage} from 'utils/utils.jsx';

const MESSAGE_MAX_LENGTH = 200;

export default class ManageAutoResponder extends React.PureComponent {
    static propTypes = {
        autoResponderActive: PropTypes.bool.isRequired,
        autoResponderMessage: PropTypes.string.isRequired,
        updateSection: PropTypes.func.isRequired,
        setParentState: PropTypes.func.isRequired,
        submit: PropTypes.func.isRequired,
        saving: PropTypes.bool.isRequired,
        error: PropTypes.string,
    };

    handleAutoResponderChecked = (e) => {
        this.props.setParentState('autoResponderActive', e.target.checked);
    };

    onMessageChanged = (e) => {
        this.props.setParentState('autoResponderMessage', e.target.value);
    };

    render() {
        const {
            autoResponderActive,
            autoResponderMessage,
        } = this.props;

        let serverError;
        if (this.props.error) {
            serverError = <label className='has-error'>{this.props.error}</label>;
        }

        const inputs = [];

        const activeToggle = (
            <div className='checkbox'>
                <label>
                    <input
                        id='autoResponderActive'
                        type='checkbox'
                        checked={autoResponderActive}
                        onChange={this.handleAutoResponderChecked}
                    />
                    {autoResponderActive ? (
                        <FormattedMessage
                            id='user.settings.notifications.autoResponderEnabled'
                            defaultMessage='Enabled'
                        />
                    ) : (
                        <FormattedMessage
                            id='user.settings.notifications.autoResponderDisabled'
                            defaultMessage='Disabled'
                        />
                    )}
                </label>
            </div>
        );

        const message = (
            <div key='changeMessage'>
                <div className='padding-top'>
                    <AutosizeTextarea
                        style={{resize: 'none'}}
                        id='autoResponderMessage'
                        className='form-control'
                        rows='5'
                        placeholder={localizeMessage('user.settings.notifications.autoResponderPlaceholder', 'Message')}
                        value={autoResponderMessage}
                        maxLength={MESSAGE_MAX_LENGTH}
                        onChange={this.onMessageChanged}
                    />
                    {serverError}
                </div>
            </div>
        );

        inputs.push(activeToggle);
        if (autoResponderActive) {
            inputs.push(message);
        }
        inputs.push((
            <div>
                <br/>
                <FormattedHTMLMessage
                    id='user.settings.notifications.autoResponderHint'
                    defaultMessage='Set a custom message that will be automatically sent in response to Direct Messages. Mentions in Public and Private Channels will not trigger the automated reply. Enabling Automatic Replies disables email and push notifications.'
                />
            </div>
        ));

        return (
            <SettingItemMax
                title={
                    <FormattedMessage
                        id='user.settings.notifications.autoResponder'
                        defaultMessage='Automatic Direct Message Replies'
                    />
                }
                width='medium'
                shiftEnter={true}
                submit={this.props.submit}
                saving={this.props.saving}
                inputs={inputs}
                updateSection={this.props.updateSection}
            />
        );
    }
}
