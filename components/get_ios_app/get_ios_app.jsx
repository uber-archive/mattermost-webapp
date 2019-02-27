// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import logoImage from 'images/uchat_color.png';

export default function GetIosApp({iosAppDownloadLink, iosAppUrlScheme}) {
    return (

        <div className='get-app get-ios-app'>
            <img
                src={logoImage}
                className='get-app__logo'
            />
            <a
                href={iosAppUrlScheme ? `${iosAppUrlScheme}://` : iosAppDownloadLink}
                className='btn btn-primary get-ios-app__open-mattermost'
            >
                <FormattedMessage
                    id='get_app.openMattermost'
                    defaultMessage={iosAppUrlScheme ? 'Open in uChat App' : 'Download uChat for iOS'}
                />
            </a>
            <span className='get-app__continue-with-browser'>
                <FormattedMessage
                    id='get_app.continueWithBrowser'
                    defaultMessage='Or {link}'
                    values={{
                        link: (
                            <Link to='/'>
                                <FormattedMessage
                                    id='get_app.continueWithBrowserLink'
                                    defaultMessage='continue with browser'
                                />
                            </Link>
                        ),
                    }}
                />
            </span>
        </div>
    );
}

GetIosApp.propTypes = {
    iosAppDownloadLink: PropTypes.string,
    iosAppUrlScheme: PropTypes.string,
};
