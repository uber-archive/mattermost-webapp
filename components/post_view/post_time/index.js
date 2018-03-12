// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getUserTimezone} from 'mattermost-redux/selectors/entities/timezone';
import {getUserCurrentTimezone} from 'mattermost-redux/utils/timezone_utils';

import PostTime from './post_time.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);
    const currentUserId = getCurrentUserId(state);
    const userTimezone = getUserTimezone(state, currentUserId);

    return {
        enableTimezone: config.EnableTimezoneSelection === 'true',
        currentUserTimezone: getUserCurrentTimezone(userTimezone),
    };
}

export default connect(mapStateToProps)(PostTime);
