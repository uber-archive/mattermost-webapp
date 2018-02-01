// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import UserStore from 'stores/user_store.jsx';
import * as UserActions from 'actions/user_actions.jsx';

const dateTimeFormat = new Intl.DateTimeFormat();

export function getBrowserTimezone() {
    return dateTimeFormat.resolvedOptions().timeZone;
}

export function autoUpdateTimezone(userTimezone) {
    const browserTimezone = getBrowserTimezone();
    const newTimezoneExists = userTimezone.automaticTimezone !== browserTimezone;

    if (userTimezone.useAutomaticTimezone && newTimezoneExists) {
        const user = UserStore.getCurrentUser();

        const timezone = {
            useAutomaticTimezone: 'true',
            automaticTimezone: browserTimezone,
            manualTimezone: userTimezone.manualTimezone
        };

        const updatedUser = {
            ...user,
            timezone
        };

        UserActions.updateUser(updatedUser);
    }
}

export function getCurrentTimezone(userTimezone) {
    if (userTimezone.useAutomaticTimezone) {
        return userTimezone.automaticTimezone;
    }
    return userTimezone.manualTimezone;
}

export function getTimezoneRegion(timezone) {
    if (timezone) {
        const split = timezone.split('/');
        if (split.length > 1) {
            const region = split.pop();
            if (region.indexOf('_') >= 0) {
                return region.replace('_', ' ');
            }
            return region;
        }
    }

    return timezone;
}
