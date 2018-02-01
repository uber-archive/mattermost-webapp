// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import AppDispatcher from 'dispatcher/app_dispatcher.jsx';
import {ActionTypes} from 'utils/constants.jsx';
import {getTimezoneRegion} from 'utils/timezone';

import Provider from './provider.jsx';
import Suggestion from './suggestion.jsx';

const timezones = global.window.mm_config ? global.window.mm_config.SupportedTimezones : [];

class TimezoneSuggestion extends Suggestion {
    render() {
        const {item, isSelection} = this.props;
        const timezone = item;

        let className = 'mentions__name';
        if (isSelection) {
            className += ' suggestion--selected';
        }

        return (
            <div
                onClick={this.handleClick}
                className={className}
            >
                {timezone}
            </div>
        );
    }
}

export default class TimezoneProvider extends Provider {
    handlePretextChanged(suggestionId, timezonePrefix) {
        if (timezonePrefix.length === 0) {
            this.displayAllTimezones(suggestionId, timezonePrefix);
            return true;
        }

        if (timezonePrefix) {
            this.filterTimezones(suggestionId, timezonePrefix);
            return true;
        }

        return false;
    }

    async displayAllTimezones(suggestionId) {
        setTimeout(() => {
            AppDispatcher.handleServerAction({
                type: ActionTypes.SUGGESTION_RECEIVED_SUGGESTIONS,
                id: suggestionId,
                matchedPretext: '',
                terms: timezones,
                items: timezones,
                component: TimezoneSuggestion
            });
        }, 0);
    }

    async filterTimezones(suggestionId, timezonePrefix) {
        const filteredTimezones = timezones.filter((t) => (
            getTimezoneRegion(t).toLowerCase().indexOf(timezonePrefix) >= 0 ||
                t.toLowerCase().indexOf(timezonePrefix) >= 0
        ));

        setTimeout(() => {
            AppDispatcher.handleServerAction({
                type: ActionTypes.SUGGESTION_RECEIVED_SUGGESTIONS,
                id: suggestionId,
                matchedPretext: timezonePrefix,
                terms: filteredTimezones,
                items: filteredTimezones,
                component: TimezoneSuggestion
            });
        }, 0);
    }
}
