// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import MattermostLogo from 'components/svg/mattermost_logo';

export default class AboutBuildModal extends React.PureComponent {
    static defaultProps = {
        show: false,
    };

    static propTypes = {

        /**
         * Determines whether modal is shown or not
         */
        show: PropTypes.bool.isRequired,

        /**
         * Function that is called when the modal is dismissed
         */
        onHide: PropTypes.func.isRequired,

        /**
         * Global config object
         */
        config: PropTypes.object.isRequired,

        /**
         * Global license object
         */
        license: PropTypes.object.isRequired,

        /**
         * Webapp build hash override. By default, webpack sets this (so it must be overridden in tests).
         */
        webappBuildHash: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.doHide = this.doHide.bind(this);
    }

    doHide() {
        this.props.onHide();
    }

    render() {
        const config = this.props.config;
        const license = this.props.license;

        let title = (
            <FormattedMessage
                id='about.teamEditiont0'
                defaultMessage='Team Edition'
            />
        );

        let subTitle = (
            <FormattedMessage
                id='about.teamEditionSt'
                defaultMessage='All your team communication in one place, instantly searchable and accessible anywhere.'
            />
        );

        let learnMore = (
            <div>
                <div>
                    <FormattedMessage
                        id='about.teamEditionLearn'
                        defaultMessage='Join the uChat community at '
                    />
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://uchat.uberinternal.com/downloads'
                    >
                        {'uchat.uberinternal.com'}
                    </a>
                </div>
            </div>
        );

        let licensee;
        if (config.BuildEnterpriseReady === 'true') {
            title = (
                <FormattedMessage
                    id='about.teamEditiont1'
                    defaultMessage='Enterprise Edition'
                />
            );

            subTitle = (
                <FormattedMessage
                    id='about.enterpriseEditionSt'
                    defaultMessage='Modern communication from behind your firewall.'
                />
            );

            learnMore = (
                <div >
                    <div id='learn_info'>
                        <FormattedMessage
                            id='about.enterpriseEditionLearn'
                            defaultMessage='Learn more at '
                        />
                        <a
                            id='learn_link'
                            target='_blank'
                            rel='noopener noreferrer'
                            ref='https://uchat.uberinternal.com/downloads'
                        >
                            {'uchat.uberinternal.com'}
                        </a>
                    </div>
                </div>
            );

            if (license.IsLicensed === 'true') {
                title = (
                    <FormattedMessage
                        id='about.enterpriseEditione1'
                        defaultMessage='Enterprise Edition'
                    />
                );
                if (license.Company) {
                    licensee = (
                        <div
                            className='form-group'
                            id='license_check'
                        >
                            <FormattedMessage
                                id='about.licensed'
                                defaultMessage='Licensed to:'
                            />
                            &nbsp;{license.Company}
                        </div>
                    );
                }
            }
        }

        let termsOfService;
        if (config.TermsOfServiceLink) {
            termsOfService = (
                <a
                    id='terms_of_service'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={config.TermsOfServiceLink}
                >
                    <FormattedMessage
                        id='about.tos'
                        defaultMessage='Terms of Service'
                    />
                </a>
            );
        }

        let privacyPolicy;
        if (config.PrivacyPolicyLink) {
            privacyPolicy = (
                <a
                    id='privacy_policy'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={config.PrivacyPolicyLink}
                >
                    <FormattedMessage
                        id='about.privacy'
                        defaultMessage='Privacy Policy'
                    />
                </a>
            );
        }

        let tosPrivacyHyphen;
        if (config.TermsOfServiceLink && config.PrivacyPolicyLink) {
            tosPrivacyHyphen = (
                <span>
                    {' - '}
                </span>
            );
        }

        // Only show build number if it's a number (so only builds from Jenkins)
        let buildnumber = (
            <div>
                <FormattedMessage
                    id='about.buildnumber'
                    defaultMessage='Build Number:'
                />
                <span id='buildnumberString'>{'\u00a0' + config.BuildNumber}</span>
            </div>
        );
        if (isNaN(config.BuildNumber)) {
            buildnumber = null;
        }

        let mmversion = config.BuildNumber;
        if (!isNaN(config.BuildNumber)) {
            mmversion = 'ci';
        }

        return (
            <Modal
                dialogClassName='about-modal'
                show={this.props.show}
                onHide={this.doHide}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title id='about_title'>
                        <FormattedMessage
                            id='about.title'
                            defaultMessage='About uChat'
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='about-modal__content'>
                        <div className='about-modal__logo'>
                            <MattermostLogo/>
                        </div>
                        <div>
                            <h3
                                className='about-modal__title'
                                id='about_modal_title'
                            >
                                {'uChat'} {title}
                            </h3>
                            <p
                                className='about-modal__subtitle padding-bottom'
                                id='about_modal_subtitle'
                            >
                                {subTitle}
                            </p>
                            <div className='form-group less'>
                                <div id='about_version'>
                                    <FormattedMessage
                                        id='about.version'
                                        defaultMessage='uChat Version:'
                                    />
                                    <span id='versionString'>{'\u00a0' + mmversion}</span>
                                </div>
                                <div>
                                    <FormattedMessage
                                        id='about.dbversion'
                                        defaultMessage='Database Schema Version:'
                                    />
                                    <span id='dbversionString'>{'\u00a0' + config.Version}</span>
                                </div>
                                {buildnumber}
                                <div>
                                    <FormattedMessage
                                        id='about.database'
                                        defaultMessage='Database:'
                                    />
                                    {'\u00a0' + config.SQLDriverName}
                                </div>
                            </div>
                            {licensee}
                        </div>
                    </div>
                    <div className='about-modal__footer'>
                        {learnMore}
                        <div className='form-group'>
                            <div
                                className='about-modal__copyright'
                                id='copyright_msg'
                            >
                                <FormattedMessage
                                    id='about.copyright'
                                    defaultMessage='Copyright 2015 - {currentYear} Uber Technologies, Inc. All rights reserved'
                                    values={{
                                        currentYear: new Date().getFullYear(),
                                    }}
                                />
                            </div>
                            <div className='about-modal__links'>
                                {termsOfService}
                                {tosPrivacyHyphen}
                                {privacyPolicy}
                            </div>
                        </div>
                    </div>
                    <div
                        className='about-modal__notice form-group padding-top x2'
                        id='about_notice'
                    >
                        <p>
                            <FormattedMarkdownMessage
                                id='about.notice'
                                defaultMessage='uChat is made possible by the open source software used in our [server](!https://about.mattermost.com/platform-notice-txt/), [desktop](!https://about.mattermost.com/desktop-notice-txt/) and [mobile](!https://about.mattermost.com/mobile-notice-txt/) apps.'
                            />
                        </p>
                    </div>
                    <div className='about-modal__hash'>
                        <p>
                            <FormattedMessage
                                id='about.hash'
                                defaultMessage='Build Hash:'
                            />
                            &nbsp;{config.BuildHash}
                            <br/>
                            <FormattedMessage
                                id='about.hashee'
                                defaultMessage='EE Build Hash:'
                            />
                            &nbsp;{config.BuildHashEnterprise}
                            <br/>
                            <FormattedMessage
                                id='about.hashwebapp'
                                defaultMessage='Webapp Build Hash:'
                            />
                            &nbsp;{/* global COMMIT_HASH */ this.props.webappBuildHash || (typeof COMMIT_HASH === 'undefined' ? '' : COMMIT_HASH)}
                        </p>
                        <p>
                            <FormattedMessage
                                id='about.date'
                                defaultMessage='Build Date:'
                            />
                            &nbsp;{config.BuildDate}
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
