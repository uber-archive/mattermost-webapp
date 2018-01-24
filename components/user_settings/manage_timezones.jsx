// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';

import * as UserActions from 'actions/user_actions.jsx';

import SettingItemMax from 'components/setting_item_max.jsx';
import {getTimezoneRegion} from 'utils/utils';

const dateTimeFormat = new Intl.DateTimeFormat();
export default class ManageTimezones extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            useAutomaticTimezone: props.useAutomaticTimezone,
            automaticTimezone: props.automaticTimezone,
            manualTimezone: props.manualTimezone,
            isSaving: false
        };
    }

    timezoneNotChanged = () => {
        const {
            useAutomaticTimezone,
            automaticTimezone,
            manualTimezone
        } = this.state;

        const {
            useAutomaticTimezone: oldUseAutomaticTimezone,
            automaticTimezone: oldAutomaticTimezone,
            manualTimezone: oldManualTimezone
        } = this.props;

        return (
            useAutomaticTimezone === oldUseAutomaticTimezone &&
            automaticTimezone === oldAutomaticTimezone &&
            manualTimezone === oldManualTimezone
        );
    };

    submitTimezoneChange = () => {
        const {
            useAutomaticTimezone,
            automaticTimezone,
            manualTimezone
        } = this.state;

        if (this.timezoneNotChanged()) {
            this.props.updateSection('');
            return;
        }

        const timezone = {
            useAutomaticTimezone,
            automaticTimezone,
            manualTimezone
        };

        UserActions.saveTimezone(
            timezone,
            () => this.props.updateSection('')
        );
    };

    handleAutomaticTimezone = (e) => {
        const useAutomaticTimezone = e.target.checked;
        let automaticTimezone = null;

        if (useAutomaticTimezone) {
            const browserTimezone = dateTimeFormat.resolvedOptions().timeZone;
            automaticTimezone = browserTimezone;
        }

        this.setState({
            useAutomaticTimezone,
            automaticTimezone
        });
    };

    handleManualTimezone = (e) => {
        this.setState({manualTimezone: e.target.value});
    };

    render() {
        const {
            useAutomaticTimezone,
            automaticTimezone,
            manualTimezone
        } = this.state;

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

        const inputs = [];

        const timezoneRegion = (
            <li
                className='section-describe'
            >
                {useAutomaticTimezone && getTimezoneRegion(automaticTimezone)}
            </li>
        );

        const automaticTimezoneInput = (
            <div className='checkbox'>
                <label>
                    <input
                        id='automaticTimezoneInput'
                        type='checkbox'
                        checked={useAutomaticTimezone}
                        onChange={this.handleAutomaticTimezone}
                    />
                    <FormattedMessage
                        id='user.settings.timezones.automatic'
                        defaultMessage='Set automatically'
                    />
                    {timezoneRegion}
                </label>
            </div>
        );

        const manualTimezoneInput = (
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
                        value={manualTimezone}
                        onChange={this.handleManualTimezone}
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

        inputs.push(automaticTimezoneInput);

        if (!useAutomaticTimezone) {
            inputs.push(manualTimezoneInput);
        }

        return (
            <SettingItemMax
                title={
                    <FormattedMessage
                        id='user.settings.display.timezone'
                        defaultMessage='Timezone'
                    />
                }
                width='medium'
                submit={this.submitTimezoneChange}
                saving={this.state.isSaving}
                inputs={inputs}
                updateSection={this.props.updateSection}
            />
        );
    }
}

ManageTimezones.propTypes = {
    user: PropTypes.object.isRequired,
    updateSection: PropTypes.func.isRequired,
    useAutomaticTimezone: PropTypes.bool.isRequired,
    automaticTimezone: PropTypes.string.isRequired,
    manualTimezone: PropTypes.string.isRequired
};
