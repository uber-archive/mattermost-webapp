// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import logoImage from 'images/uchat_color.png';

import {useSafeUrl} from 'utils/url';

import AppStoreButton from 'images/app-store-button.png';

export default function GetIosApp() {
    return (
        <div className='get-app get-ios-app'>
            <img
                src={logoImage}
                className='get-app__logo'
            />
            <h1 className='get-app__header'>
                <FormattedMessage
                    id='get_app.iosHeader'
                    defaultMessage='uChat works best if you switch to our iPhone app'
                />
            </h1>
            <hr/>
            <a
                className='get-ios-app__app-store-link'
                href={useSafeUrl(global.window.mm_config.IosAppDownloadLink)}
                rel='noopener noreferrer'
            >
                <img src={AppStoreButton}/>
            </a>
            <a
                href='/login'
                className='btn btn-secondary get-ios-app__continue-with-browser'
            >
                <FormattedMessage
                    id='get_app.continueWithBrowserLink'
                    defaultMessage='Continue to mobile site'
                />
            </a>
        </div>
    );
}
