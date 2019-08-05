// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import OooAutoResponder from './ooo_auto_responder';

export default class OooSettings extends React.PureComponent {
    static propTypes = {
        user: PropTypes.object.isRequired,
        activeTab: PropTypes.string,
        activeSection: PropTypes.string,
        prevActiveSection: PropTypes.string,
        updateSection: PropTypes.func,
        closeModal: PropTypes.func.isRequired,
        collapseModal: PropTypes.func.isRequired,
    }

    render() {
        return (
            <div>
                <OooAutoResponder
                    user={this.props.user}
                    activeSection={this.props.activeSection}
                    prevActiveSection={this.props.prevActiveSection}
                    updateSection={this.props.updateSection}
                    closeModal={this.props.closeModal}
                    collapseModal={this.props.collapseModal}
                />
                <div className='divider-dark'/>
            </div>
        );
    }
}
