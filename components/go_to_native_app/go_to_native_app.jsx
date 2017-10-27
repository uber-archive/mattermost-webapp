// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import safeOpenProtocol from 'custom-protocol-detection';

import logoImage from 'images/uchat_color.png';

export default class GoNativeApp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            protocolUnsupported: false,
            browserUnsupported: false,
        };
    }

    render() {
        const {protocolUnsupported, browserUnsupported} = this.state;

        let nativeLocation = window.location.href.replace('/vault#', '');
        nativeLocation = nativeLocation.replace(/^(https|http)/, 'uberchat');

        safeOpenProtocol(nativeLocation,
            () => this.setState({protocolUnsupported: true}),
            () => setTimeout(redirectWeb, 3000),
            () => this.setState({browserUnsupported: true})
        );

        let goNativeAppMessage = null;
        if (protocolUnsupported) {
            goNativeAppMessage = (
                <FormattedMessage
                    id='get_app.protocolUnsupported'
                    defaultMessage='Unable to open uChat.'
                />
            );
        } else if (browserUnsupported) {
            goNativeAppMessage = (
                <FormattedMessage
                    id='get_app.browserUnsupported'
                    defaultMessage='This browser does not support opening applications.'
                />
            );
        } else {
            goNativeAppMessage = (
                <FormattedMessage
                    id='get_app.systemDialogMessage'
                    defaultMessage='Please click `Open uChat` if you see the system dialog.'
                />
            );
        }

        // prompt user to download in case they don't have the mobile app.
        return (
            <div className='get-app get-app--android'>
                <img
                    src={logoImage}
                    className='get-app__logo'
                />
                <div className='get-app__status'>
                    {goNativeAppMessage}
                </div>
                <div>
                    <div className='get-app__alternative'>
                        <FormattedMessage
                            id='get_app.ifNothingPrompts'
                            defaultMessage='If nothing prompts from browser,'
                        />
                    </div>
                    <a
                        href='/downloads'
                        className='btn btn-primary get-android-app__open-mattermost'
                    >
                        <FormattedMessage
                            id='get_app.downloadMattermost'
                            defaultMessage='Download uChat'
                        />
                    </a>
                </div>
                <a
                    href={window.location.href.replace('/vault#', '')}
                    className='btn btn-secondary get-app__continue'
                >
                    <FormattedMessage
                        id='get_app.continueToBrowser'
                        defaultMessage='Continue to web site'
                    />
                </a>
            </div>
        );
    }
}

function redirectWeb() {
    // window.location = window.location.href.replace('/vault#', '');
}
