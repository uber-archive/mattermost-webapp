// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {useSafeUrl} from 'utils/url.jsx';

import logoImage from 'images/uchat_color.png';

export default function GetAndroidApp() {
    return (
        <div className='get-app get-android-app'>
            <img
                src={logoImage}
                className='get-app__logo'
            />
            <a
                className='btn btn-primary get-android-app__open-mattermost'
                href={useSafeUrl(global.window.mm_config.AndroidAppDownloadLink)}
            >
                <FormattedMessage
                    id='get_app.openMattermost'
                    defaultMessage='Download uChat for Android'
                />
            </a>
            <a
                href='/login'
                className='btn btn-secondary get-android-app__continue-with-browser'
            >
                <FormattedMessage
                    id='get_app.continueWithBrowserLink'
                    defaultMessage='Continue to mobile site'
                />
            </a>
        </div>
    );
}
