// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import {getFileThumbnailUrl, getFileUrl} from 'mattermost-redux/utils/file_utils';

import Constants from 'utils/constants.jsx';
import * as FileUtils from 'utils/file_utils';
import * as Utils from 'utils/utils.jsx';

import downloadIcon from 'images/download_CTA.svg';

export default class FileAttachment extends React.Component {
    constructor(props) {
        super(props);

        this.loadFiles = this.loadFiles.bind(this);
        this.onAttachmentClick = this.onAttachmentClick.bind(this);

        this.state = {
            loaded: Utils.getFileType(props.fileInfo.extension) !== 'image'
        };
    }

    componentDidMount() {
        this.loadFiles();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.fileInfo.id !== this.props.fileInfo.id) {
            const extension = nextProps.fileInfo.extension;

            this.setState({
                loaded: Utils.getFileType(extension) !== 'image' && extension !== 'svg'
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (!this.state.loaded && this.props.fileInfo.id !== prevProps.fileInfo.id) {
            this.loadFiles();
        }
    }

    loadFiles() {
        const fileInfo = this.props.fileInfo;
        const fileType = Utils.getFileType(fileInfo.extension);

        if (fileType === 'image') {
            const thumbnailUrl = getFileThumbnailUrl(fileInfo.id);

            Utils.loadImage(thumbnailUrl, this.handleImageLoaded);
        } else if (fileInfo.extension === 'svg') {
            Utils.loadImage(getFileUrl(fileInfo.id), this.handleImageLoaded);
        }
    }

    handleImageLoaded = () => {
        this.setState({
            loaded: true
        });
    }

    onAttachmentClick(e) {
        e.preventDefault();
        this.props.handleImageClick(this.props.index);
    }

    render() {
        const fileInfo = this.props.fileInfo;
        const fileName = fileInfo.name;

        const fileUrl = getFileUrl(fileInfo.id);
        const type = Utils.getFileType(fileInfo.extension);

        let thumbnail;
        if (this.state.loaded) {
            if (fileInfo.extension === 'svg') {
                thumbnail = (
                    <img
                        className='post-image normal'
                        src={getFileUrl(fileInfo.id)}
                    />
                );
            } else {
                thumbnail = <div className={'file-icon ' + Utils.getIconClassName(type)}/>;
            }
        } else {
            thumbnail = <div className='post-image__load'/>;
        }

        let trimmedFilename;
        if (fileName.length > 35) {
            trimmedFilename = fileName.substring(0, Math.min(35, fileName.length)) + '...';
        } else {
            trimmedFilename = fileName;
        }

        const canDownloadFiles = FileUtils.canDownloadFiles();

        let filenameOverlay;
        if (this.props.compactDisplay) {
            filenameOverlay = (
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    className='hidden-xs'
                    delayShow={1000}
                    placement='top'
                    overlay={
                        <Tooltip
                            className='hidden-xs'
                            id='file-name__tooltip'
                        >
                            {fileName}
                        </Tooltip>
                    }
                >
                    <a
                        href='#'
                        onClick={this.onAttachmentClick}
                        className='post-image__name'
                        rel='noopener noreferrer'
                    >
                        <span
                            className='icon'
                            dangerouslySetInnerHTML={{__html: Constants.ATTACHMENT_ICON_SVG}}
                        />
                        {trimmedFilename}
                    </a>
                </OverlayTrigger>
            );
        } else if (canDownloadFiles) {
            filenameOverlay = (
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    className='hidden-xs'
                    delayShow={1000}
                    placement='top'
                    overlay={
                        <Tooltip
                            className='hidden-xs'
                            id='file-name__tooltip'
                        >
                            {Utils.localizeMessage('file_attachment.download', 'Download') + ' "' + fileName + '"'}
                        </Tooltip>
                    }
                >
                    <a
                        href={fileUrl}
                        download={fileName}
                        className='post-image__name'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {trimmedFilename}
                    </a>
                </OverlayTrigger>
            );
        } else {
            filenameOverlay = (
                <span className='post-image__name'>
                    {trimmedFilename}
                </span>
            );
        }

        let downloadButton = null;
        if (canDownloadFiles) {
            downloadButton = (
                <a
                    href={fileUrl}
                    download={fileName}
                    className='post-image__download'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <span className='fa fa-download'/>
                </a>
            );
        }

        let fileAttachment;
        if (type === 'image' && !this.props.compactDisplay) {
            fileAttachment = (
                <div className='post-image__preview'>
                    <a
                        href='#'
                        onClick={this.onAttachmentClick}
                    >
                        <img
                            className='post-image__image'
                            src={getFileThumbnailUrl(fileInfo.id)}
                        />
                    </a>
                    <div className='post-image__info'>
                        <a
                            href={fileUrl}
                            download={fileName}
                            className='post-image__download'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <img src={downloadIcon}/>
                            {filenameOverlay}
                            <span className='post-image__size'>{Utils.fileSizeToString(fileInfo.size)}</span>
                        </a>
                    </div>
                </div>
            );
        } else {
            fileAttachment = (
                <div className='post-image__column'>
                    <a
                        className='post-image__thumbnail'
                        href='#'
                        onClick={this.onAttachmentClick}
                    >
                        {thumbnail}
                    </a>
                    <div className='post-image__details'>
                        {filenameOverlay}
                        <div>
                            {downloadButton}
                            <span className='post-image__type'>{fileInfo.extension.toUpperCase()}</span>
                            <span className='post-image__size'>{Utils.fileSizeToString(fileInfo.size)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                {fileAttachment}
            </div>
        );
    }
}

FileAttachment.propTypes = {
    fileInfo: PropTypes.object.isRequired,

    // the index of this attachment preview in the parent FileAttachmentList
    index: PropTypes.number.isRequired,

    // handler for when the thumbnail is clicked passed the index above
    handleImageClick: PropTypes.func,

    compactDisplay: PropTypes.bool
};
