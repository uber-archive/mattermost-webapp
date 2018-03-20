// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {getSupportedTimezones as getTimezones} from 'mattermost-redux/selectors/entities/general';
import {isMinimumServerVersion} from 'mattermost-redux/utils/helpers';
import {Client4} from 'mattermost-redux/client';
import moment from 'moment-timezone';

import store from 'stores/redux_store.jsx';

export function getSupportedTimezones() {
    return getTimezones(store.getState());
}

export function getBrowserTimezone() {
    return moment.tz.guess();
}

export function isTimezoneSupportEnabled() {
    return isMinimumServerVersion(Client4.getServerVersion(), 4, 9);
}
