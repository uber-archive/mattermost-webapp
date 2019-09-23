// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {Modal} from 'react-bootstrap';

import {FormattedMessage, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';

import Constants from 'utils/constants.jsx';
import * as Utils from 'utils/utils.jsx';
import {AsyncComponent} from 'components/async_load';

import OooSetting from 'bundle-loader?lazy!components/status_dropdown/ooo_settings';

class AutoResponderModal extends React.Component {
    static propTypes = {
        currentUser: PropTypes.object,
        onHide: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            active_section: '',
            prev_active_section: 'dummySectionName', // dummy value that should never match any section name
            show: true,
        };
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (Utils.cmdOrCtrlPressed(e) && e.shiftKey && Utils.isKeyPressed(e, Constants.KeyCodes.A)) {
            this.handleHide();
        }
    };

    // Called when the close button is pressed on the main modal
    handleHide = () => {
        this.setState({
            show: false,
        });
    };

    // called after the dialog is fully hidden and faded out
    handleHidden = () => {
        this.setState({
            active_section: '',
            prev_active_section: 'dummySectionName',
        });
        this.props.onHide();
    };

    updateSection = (section) => {
        this.setState({
            prev_active_section: section ? '' : this.state.active_section,
            active_section: section,
            show: !this.state.show,
        });
    };

    render() {
        if (this.props.currentUser == null) {
            return (<div/>);
        }

        return (
            <Modal
                id='oooAutoResponderModal'
                dialogClassName='auto-responder-modal'
                show={this.state.show}
                onHide={this.handleHide}
                onExited={this.handleHidden}
                enforceFocus={this.state.enforceFocus}
            >
                <Modal.Header
                    id='oooAutoResponderHeader'
                    closeButton={true}
                >
                    <Modal.Title id='oooAutoResponderTitle'>
                        <FormattedMessage
                            id='status.dropdown.modal.title'
                            defaultMessage='Automatic Replies(Out of Office)'
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body ref='modalBody'>

                    <div>
                        <AsyncComponent
                            doLoad={OooSetting}
                            updateSection={this.updateSection}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default injectIntl(AutoResponderModal);
