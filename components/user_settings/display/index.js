// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getSupportedTimezones} from 'mattermost-redux/actions/general';
import {getConfig, getSupportedTimezones as getTimezones} from 'mattermost-redux/selectors/entities/general';

import UserSettingnsDisplay from './user_settings_display.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);
    const timezones = getTimezones(state);

    const allowCustomThemes = config.AllowCustomThemes === 'true';
    const enableLinkPreviews = config.EnableLinkPreviews === 'true';
    const defaultClientLocale = config.DefaultClientLocale;
    const enableThemeSelection = config.EnableThemeSelection === 'true';
    const enableTimezone = config.EnableTimezoneSelection === 'true';

    return {
        allowCustomThemes,
        enableLinkPreviews,
        defaultClientLocale,
        enableThemeSelection,
        enableTimezone,
        timezones,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getSupportedTimezones,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingnsDisplay);
