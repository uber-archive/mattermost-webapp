// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import {getFileThumbnailUrl, getFileUrl} from 'mattermost-redux/utils/file_utils';

import Constants from 'utils/constants.jsx';
import * as FileUtils from 'utils/file_utils';
import * as Utils from 'utils/utils.jsx';

import removeCTA from 'images/delete_CTA.svg';
import downloadCTA from 'images/download_CTA.svg';

export default class FileAttachment extends React.Component {
    constructor(props) {
        super(props);

        this.loadFiles = this.loadFiles.bind(this);
        this.onAttachmentClick = this.onAttachmentClick.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);

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

        if (fileType === 'image' || fileType === 'svg') {
            let thumbnailUrl;
            if (this.props.displayType === 'preview') {
                thumbnailUrl = getFileUrl(fileInfo.id);
            } else {
                thumbnailUrl = getFileThumbnailUrl(fileInfo.id);
            }

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
        if (this.props.displayType !== 'preview') {
            this.props.handleImageClick(this.props.index);
        }
    }

    onRemoveClick(e) {
        e.preventDefault();
        if (this.props.handleRemoveClick) {
            this.props.handleRemoveClick();
        }
    }

    render() {
        const fileInfo = this.props.fileInfo;
        const fileName = fileInfo.name;

        const fileUrl = getFileUrl(fileInfo.id);
        const type = Utils.getFileType(fileInfo.extension);

        let thumbnail;
        if (this.state.loaded) {
            if (type === 'image' || type === 'svg') {
                let thumbnailUrl;
                if (this.props.displayType === 'preview') {
                    thumbnailUrl = getFileUrl(fileInfo.id);
                } else {
                    thumbnailUrl = getFileThumbnailUrl(fileInfo.id);
                }

                thumbnail = (
                    <div
                        className='post-image'
                        style={{
                            backgroundImage: `url(${thumbnailUrl})`
                        }}
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

        const canDownloadFiles = FileUtils.canDownloadFiles() && this.props.displayType !== 'preview';

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
        } else if (this.props.displayType === 'preview') {
            filenameOverlay = (
                <OverlayTrigger
                    className='hidden-xs'
                    delayShow={1000}
                    placement='top'
                    overlay={(
                        <Tooltip
                            id='file-name__tooltip'
                            className='hidden-xs'
                        >
                            {fileName}
                        </Tooltip>
                    )}
                >
                    <a
                        href='#'
                        className='post-image__name'
                    >
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

        let fileCTA;
        if (this.props.displayType === 'preview') {
            fileCTA = (
                <a
                    href='#'
                    className='file-preview__remove'
                    onClick={this.onRemoveClick}
                >
                    <img src={removeCTA}/>
                </a>
            );
        } else {
            fileCTA = (
                <a
                    href={fileUrl}
                    download={fileName}
                    className='post-image__download'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <img src={downloadCTA}/>
                </a>
            );
        }

        let fileAttachment;
        if ((type === 'image' || type === 'svg') && !this.props.compactDisplay && this.props.displayType !== 'preview') {
            let thumbnailUrl = getFileThumbnailUrl(fileInfo.id);
            if (Utils.isGIFImage(fileInfo.extension)) {
                thumbnailUrl = getFileUrl(fileInfo.id);
            }

            fileAttachment = (
                <div className='post-image__preview'>
                    <a
                        href='#'
                        onClick={this.onAttachmentClick}
                    >
                        <img
                            className='post-image__image'
                            src={thumbnailUrl}
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
                            <img src={downloadCTA}/>
                            {filenameOverlay}
                            <span className='post-image__size'>{Utils.fileSizeToString(fileInfo.size)}</span>
                        </a>
                    </div>
                </div>
            );
        } else {
            fileAttachment = (
                <div
                    className={this.props.displayType === 'preview' ? 'post-image__column preview' : 'post-image__column'}
                >
                    <a
                        className='post-image__thumbnail'
                        href='#'
                        onClick={this.onAttachmentClick}
                    >
                        {thumbnail}
                    </a>
                    <div className='post-image__details'>
                        {filenameOverlay}
                        <div className='post-image__info'>
                            <span className='post-image__type'>{fileInfo.extension.toUpperCase()}</span>
                            <span className='post-image__size'>{Utils.fileSizeToString(fileInfo.size)}</span>
                        </div>
                        <div>{fileCTA}</div>
                    </div>
                </div>
            );
        }
        return fileAttachment;
    }
}

FileAttachment.propTypes = {
    fileInfo: PropTypes.object.isRequired,

    // the index of this attachment preview in the parent FileAttachmentList
    index: PropTypes.number.isRequired,

    // handler for when the thumbnail is clicked passed the index above
    handleImageClick: PropTypes.func,

    handleRemoveClick: PropTypes.func,

    // available values:
    // (default) inline: the inline display for files uploaded
    // preview: the preview display under the text input field
    displayType: PropTypes.string,

    compactDisplay: PropTypes.bool
};
