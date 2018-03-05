// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import PostTime from './post_time.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);

    return {
        enableTimezone: config.EnableTimezoneSelection === 'true',
    };
}

export default connect(mapStateToProps)(PostTime);
