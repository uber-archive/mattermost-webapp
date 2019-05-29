// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import OooAutoResponder from './ooo_auto_responder';

export default class OooSettings extends React.PureComponent {
    static propTypes = {
        user: PropTypes.object.isRequired,
        updateSection: PropTypes.func,
    };

    render() {
        return (
            // eslint-disable-next-line react/jsx-filename-extension
            <div>
                <OooAutoResponder
                    user={this.props.user}
                    updateSection={this.props.updateSection}
                />
                <div className='divider-dark'/>
            </div>
        );
    }
}
