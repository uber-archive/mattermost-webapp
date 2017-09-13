// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getMe} from 'mattermost-redux/actions/users';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import UserSettingsGeneralTab from './user_settings_general_uchat.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);

    const sendEmailNotifications = config.SendEmailNotifications === 'true';
    const requireEmailVerification = config.RequireEmailVerification === 'true';
    const maxFileSize = parseInt(config.MaxFileSize, 10);
    const ldapFirstNameAttributeSet = config.LdapFirstNameAttributeSet === 'true';
    const ldapLastNameAttributeSet = config.LdapLastNameAttributeSet === 'true';
    const samlFirstNameAttributeSet = config.SamlFirstNameAttributeSet === 'true';
    const samlLastNameAttributeSet = config.SamlLastNameAttributeSet === 'true';
    const ldapNicknameAttributeSet = config.LdapNicknameAttributeSet === 'true';
    const samlNicknameAttributeSet = config.SamlNicknameAttributeSet === 'true';
    const positionAttributeSet = config.PositionAttributeSet === 'true';

    return {
        sendEmailNotifications,
        requireEmailVerification,
        maxFileSize,
        ldapFirstNameAttributeSet,
        ldapLastNameAttributeSet,
        samlFirstNameAttributeSet,
        samlLastNameAttributeSet,
        ldapNicknameAttributeSet,
        samlNicknameAttributeSet,
        positionAttributeSet,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getMe,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsGeneralTab);
