// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateMe} from 'mattermost-redux/actions/users';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import OooAutoResponder from './ooo_auto_reponder.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);

    const enableAutoResponder = config.ExperimentalEnableAutomaticReplies === 'true';
    const enableOutOfOfficeDatePicker = config.EnableOutOfOfficeDatePicker === 'true' && enableAutoResponder;

    return {
        enableAutoResponder,
        enableOutOfOfficeDatePicker,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({updateMe}, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OooAutoResponder);
