// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getUserTimezone} from 'mattermost-redux/selectors/entities/timezone';
import {getUserCurrentTimezone} from 'mattermost-redux/utils/timezone_utils';
import {getBool} from 'mattermost-redux/selectors/entities/preferences';

import {Preferences} from 'utils/constants.jsx';

import LocalDateTime from './local_date_time';

function mapStateToProps(state) {
    const config = getConfig(state);
    const currentUserId = getCurrentUserId(state);
    const userTimezone = getUserTimezone(state, currentUserId);

    return {
        enableTimezone: config.EnableTimezoneSelection === 'true',
        useMilitaryTime: getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false),
        timezone: getUserCurrentTimezone(userTimezone),
    };
}

export default connect(mapStateToProps)(LocalDateTime);
