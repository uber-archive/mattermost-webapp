// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {ActionTypes} from 'utils/constants.jsx';

export function showResetStatusDialog(showDialog, newStatus) {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.SHOW_RESET_STATUS_MODAL,
            showDialog,
            newStatus,
        });
    };
}
