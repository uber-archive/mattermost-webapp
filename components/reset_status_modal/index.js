// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {savePreferences} from 'mattermost-redux/actions/preferences';
import {setStatus} from 'mattermost-redux/actions/users';
import {Preferences} from 'mattermost-redux/constants';
import {get} from 'mattermost-redux/selectors/entities/preferences';

import {autoResetStatus} from 'actions/user_actions.jsx';
import {showResetStatusDialog} from 'actions/views/reset_status';

import ResetStatusModal from './reset_status_modal.jsx';

function mapStateToProps(state, ownProps) {
    const {currentUserId} = state.entities.users;
    const showDialog = state.views.resetStatus.resetStatus.showDialog;
    const newStatus = state.views.resetStatus.resetStatus.newStatus;

    return {
        ...ownProps,
        autoResetPref: get(state, Preferences.CATEGORY_AUTO_RESET_MANUAL_STATUS, currentUserId, ''),
        showDialog,
        newStatus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            autoResetStatus,
            setStatus,
            savePreferences,
            showResetStatusDialog,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetStatusModal);
