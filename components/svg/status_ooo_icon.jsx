// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

export default class StatusOooIcon extends React.PureComponent {
    render() {
        return (
            <span {...this.props}>
                <FormattedMessage
                    id='mobile.set_status.online.icon'
                    defaultMessage='Out of Office Icon'
                >
                    {(ariaLabel) => (
                        <svg
                            width='100%'
                            height='100%'
                            viewBox='0 0 20 20'
                            style={style}
                            role='icon'
                            aria-label={ariaLabel}
                        >
                            <path
                                className='ooo--icon'
                                d='M10,0c5.519,0 10,4.481 10,10c0,5.519 -4.481,10 -10,10c-5.519,0 -10,-4.481 -10,-10c0,-5.519 4.481,-10 10,-10Z'
                            />
                        </svg>
                    )}
                </FormattedMessage>
            </span>
        );
    }
}

const style = {
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    strokeLinejoin: 'round',
    strokeMiterlimit: 1.41421,
};
