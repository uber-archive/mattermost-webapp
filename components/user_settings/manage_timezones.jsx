// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';

import {updateUser} from 'actions/user_actions.jsx';

import SettingItemMax from 'components/setting_item_max.jsx';

export default class ManageTimezones extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timezone: props.timezone,
            isSaving: false
        };
    }

    setTimezone = (e) => {
        this.setState({timezone: e.target.value});
    };

    changeTimezone = (e) => {
        e.preventDefault();

        if (this.props.user.timezone === this.state.timezone) {
            this.props.updateSection(e);
        } else {
            this.submitUser({
                ...this.props.user,
                timezone: this.state.timezone
            });
        }
    };

    submitUser = (user) => {
        this.setState({isSaving: true});

        updateUser(
            user,
            () => {
                // GlobalActions.newTimezoneSelected(user.timezone);
                // GlobalActions.newLocalizationSelected(user.timezone);
            },
            (err) => {
                let serverError;
                if (err.message) {
                    serverError = err.message;
                } else {
                    serverError = err;
                }
                this.setState({serverError, isSaving: false});
            }
        );
    };

    render() {
        let serverError;
        if (this.state.serverError) {
            serverError = <label className='has-error'>{this.state.serverError}</label>;
        }

        const options = [];
        const friendlyTimezones = global.window.mm_config.FriendlyTimezones;

        friendlyTimezones.forEach((zone) => {
            options.push(
                <option
                    key={zone.FriendlyName}
                    value={zone.ProminentTimezone}
                >
                    {zone.FriendlyName}
                </option>
            );
        });

        const input = (
            <div key='changeTimezone'>
                <br/>
                <label className='control-label'>
                    <FormattedMessage
                        id='user.settings.timezones.change'
                        defaultMessage='Change timezone'
                    />
                </label>
                <div className='padding-top'>
                    <select
                        id='displayTimezone'
                        ref='timezone'
                        className='form-control'
                        value={this.state.timezone}
                        onChange={this.setTimezone}
                    >
                        {options}
                    </select>
                    {serverError}
                </div>
                <div>
                    <br/>
                    <FormattedHTMLMessage
                        id='user.settings.timezones.promote'
                        defaultMessage='Select the time zone used for timestamps in the user interface and email notifications.'
                    />
                </div>
            </div>
        );

        return (
            <SettingItemMax
                title={
                    <FormattedMessage
                        id='user.settings.display.timezone'
                        defaultMessage='Timezone'
                    />
                }
                width='medium'
                submit={this.changeTimezone}
                saving={this.state.isSaving}
                inputs={[input]}
                updateSection={this.props.updateSection}
            />
        );
    }
}

ManageTimezones.propTypes = {
    user: PropTypes.object.isRequired,
    timezone: PropTypes.string.isRequired,
    updateSection: PropTypes.func.isRequired
};
