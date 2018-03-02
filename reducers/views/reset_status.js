// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {combineReducers} from 'redux';

import {ActionTypes} from 'utils/constants.jsx';

const initialState = {
    showDialog: false,
};

function resetStatus(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.SHOW_RESET_STATUS_MODAL: {
        return {
            ...state,
            showDialog: action.showDialog,
            newStatus: action.newStatus,
        };
    }
    default:
        return state;
    }
}

export default combineReducers({
    resetStatus,
});
