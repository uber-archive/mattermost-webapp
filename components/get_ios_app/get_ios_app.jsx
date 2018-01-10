// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import logoImage from 'images/uchat_color.png';

const {IosAppUrlScheme} = global.mm_config;

export default function GetIosApp({iosAppDownloadLink}) {
    return (

        <div className='get-app get-ios-app'>
            <img
                src={logoImage}
                className='get-app__logo'
            />
            <a
                href={IosAppUrlScheme ? `${IosAppUrlScheme}://` : iosAppDownloadLink}
                className='btn btn-primary get-ios-app__open-mattermost'
            >
                <FormattedMessage
                    id='get_app.openMattermost'
                    defaultMessage={IosAppUrlScheme ? 'Open in uChat App' : 'Download uChat for iOS'}
                />
            </a>
            <a
                href='/login'
                className='btn btn-secondary get-ios-app__continue-with-browser'
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

GetIosApp.propTypes = {
    iosAppDownloadLink: PropTypes.string,
};
