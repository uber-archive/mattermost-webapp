// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {getSupportedTimezones as getTimezones} from 'mattermost-redux/selectors/entities/general';

import store from 'stores/redux_store.jsx';

const dateTimeFormat = new Intl.DateTimeFormat();

export function getSupportedTimezones() {
    return getTimezones(store.getState());
}

export function getBrowserTimezone() {
    return dateTimeFormat.resolvedOptions().timeZone;
}

