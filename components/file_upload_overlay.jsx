// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import fileOverlayImage from 'images/filesOverlay.png';
import {localizeMessage} from 'utils/utils.jsx';

export default function FileUploadOverlay(props) {
    var overlayClass = 'file-overlay hidden';
    if (props.overlayType === 'right') {
        overlayClass += ' right-file-overlay';
    } else if (props.overlayType === 'center') {
        overlayClass += ' center-file-overlay';
    }

    return (
        <div className={overlayClass}>
            <div className='overlay__indent'>
                <div className='overlay__circle'>
                    <img
                        className='overlay__files'
                        src={fileOverlayImage}
                        alt='Files'
                    />
                    <span>
                        <i
                            className='fa fa-upload'
                            title={localizeMessage('generic_icons.upload', 'Upload Icon')}
                        />
                        <FormattedMessage
                            id='upload_overlay.info'
                            defaultMessage='Drop a file to upload it.'
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}

FileUploadOverlay.propTypes = {
    overlayType: PropTypes.string,
};
