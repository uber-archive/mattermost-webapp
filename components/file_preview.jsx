// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import FileAttachment from 'components/file_attachment.jsx';
import loadingGif from 'images/load.gif';

export default class FilePreview extends React.Component {
    static propTypes = {
        onRemove: PropTypes.func.isRequired,
        fileInfos: PropTypes.arrayOf(PropTypes.object).isRequired,
        uploadsInProgress: PropTypes.array
    };

    static defaultProps = {
        fileInfos: [],
        uploadsInProgress: []
    };

    constructor(props) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidUpdate() {
        if (this.props.uploadsInProgress.length > 0) {
            this.refs[this.props.uploadsInProgress[0]].scrollIntoView();
        }
    }

    handleRemove(id) {
        this.props.onRemove(id);
    }

    render() {
        var previews = [];
        const fileInfos = this.props.fileInfos.sort((a, b) => a.create_at - b.create_at);
        fileInfos.forEach((info, index) => {
            previews.push(
                <FileAttachment
                    index={index}
                    key={info.id}
                    fileInfo={info}
                    displayType='preview'
                    handleRemoveClick={this.handleRemove.bind(this, info.id)}
                />
            );
        });

        this.props.uploadsInProgress.forEach((clientId) => {
            previews.push(
                <div
                    ref={clientId}
                    key={clientId}
                    className='file-preview'
                    data-client-id={clientId}
                >
                    <img
                        className='spinner'
                        src={loadingGif}
                    />
                    <a
                        className='file-preview__remove'
                        onClick={this.handleRemove.bind(this, clientId)}
                    >
                        <i className='fa fa-remove'/>
                    </a>
                </div>
            );
        });

        return (
            <div
                className='file-preview__container'
                ref='container'
            >
                {previews}
            </div>
        );
    }
}
