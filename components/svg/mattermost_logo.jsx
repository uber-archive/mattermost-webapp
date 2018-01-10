// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

export default class MattermostLogo extends React.PureComponent {
    render() {
        return (
            <span {...this.props}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 500 487'
                >
                    <path
                        className='uchat-bubble-color'
                        fill='#8ed0bc'
                        d='M433.06,0H63.75A63.8,63.8,0,0,0,0,63.85L2.31,320.7a63.8,63.8,0,0,0,63.75,63.85H377.24l97.59,97.74a14.23,14.23,0,0,0,24.29-10.08V384.55L500,63.85C500,28.59,468.27,0,433.06,0Z'
                    />
                    <path
                        className='uchat-letter-color'
                        fill='#fff'
                        d='M315.2,80.76V213.07c0,44.18-19.49,62.53-65.2,62.53s-65.2-18.35-65.2-62.53V75h-44Q135,75,135,80.76V215.24C135,289.13,181.91,315,250,315s115-25.83,115-99.72V75H321Q315.2,75,315.2,80.76Z'
                    />
                </svg>
            </span>
        );
    }
}
