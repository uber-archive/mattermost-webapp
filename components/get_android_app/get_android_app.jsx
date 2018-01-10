// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {useSafeUrl} from 'utils/url';

import logoImage from 'images/uchat_color.png';

export default function GetAndroidApp({androidAppDownloadLink}) {
    return (
        <div className='get-app get-android-app'>
            <img
                src={logoImage}
                className='get-app__logo'
            />
            <a
                className='btn btn-primary get-android-app__open-mattermost'
                href={useSafeUrl(androidAppDownloadLink)}
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
                    id='get_app.continueWithBrowser'
                    defaultMessage='Or {link}'
                    values={{
                        link: (
                            <Link to='/switch_team'>
                                <FormattedMessage
                                    id='get_app.continueWithBrowserLink'
                                    defaultMessage='continue with browser'
                                />
                            </Link>
                        ),
                    }}
                />
            </a>
        </div>
    );
}

GetAndroidApp.propTypes = {
    androidAppDownloadLink: PropTypes.string,
};
