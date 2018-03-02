// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import StatusDropdown from 'components/status_dropdown/status_dropdown.jsx';
import {showResetStatusModal} from 'actions/global_actions.jsx';

function mapStateToProps(state) {
    const currentUser = getCurrentUser(state);

    if (!currentUser) {
        return {};
    }

    const userId = currentUser.id;
    return {
        userId,
        profilePicture: Client4.getProfilePictureUrl(userId, currentUser.last_picture_update),
        status: getStatusForUserId(state, userId),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setStatus,
            showResetStatusModal,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusDropdown);
