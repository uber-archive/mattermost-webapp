// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import {useSafeUrl} from 'utils/url';

import logoImage from 'images/uchat_color.png';

export default function GetAndroidApp({androidAppDownloadLink, history, location}) {
    const onContinue = (e) => {
        e.preventDefault();

        const redirectTo = (new URLSearchParams(location.search)).get('redirect_to');
        if (redirectTo) {
            history.push(redirectTo);
        } else {
            history.push('/');
        }
    };

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
            <span className='get-app__continue-with-browser'>
                <FormattedMessage
                    id='get_app.continueWithBrowser'
                    defaultMessage='Or {link}'
                    values={{
                        link: (
                            <a
                                onClick={onContinue}
                                className='get-android-app__continue'
                            >

                                <FormattedMessage
                                    id='get_app.continueWithBrowserLink'
                                    defaultMessage='continue with browser'
                                />
                            </a>
                        ),
                    }}
                />
            </span>
        </div>
    );
}

GetAndroidApp.propTypes = {
    androidAppDownloadLink: PropTypes.string,
};
