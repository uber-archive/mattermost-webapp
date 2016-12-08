// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Popover, Tooltip} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import LocalDateTime from 'components/local_date_time';
import {browserHistory} from 'utils/browser_history';
import {openDirectChannelToUser} from 'actions/channel_actions.jsx';
import * as GlobalActions from 'actions/global_actions.jsx';
import * as WebrtcActions from 'actions/webrtc_actions.jsx';
import TeamStore from 'stores/team_store.jsx';
import UserStore from 'stores/user_store.jsx';
import WebrtcStore from 'stores/webrtc_store.jsx';
import Constants from 'utils/constants.jsx';
import * as Utils from 'utils/utils.jsx';

const UserStatuses = Constants.UserStatuses;

import emailIcon from 'images/icons/email_cta.png';
import dmIcon from 'images/icons/dm_cta.png';
import calendarIcon from 'images/icons/calendar_cta.png';

class ProfilePopoverUchat extends React.Component {
    static getComponentName() {
        return 'ProfilePopoverUchat';
    }

    static propTypes = {

        /**
         * Source URL from the image to display in the popover
         */
        src: PropTypes.string.isRequired,

        /**
         * User the popover is being opened for
         */
        user: PropTypes.object.isRequired,

        /**
         * Status for the user, either 'offline', 'away', 'dnd' or 'online'
         */
        status: PropTypes.string,

        /**
         * Set to true if the user is in a WebRTC call
         */
        isBusy: PropTypes.bool,

        /**
         * Function to call to hide the popover
         */
        hide: PropTypes.func,

        /**
         * Set to true if the popover was opened from the right-hand
         * sidebar (comment thread, search results, etc.)
         */
        isRHS: PropTypes.bool,

        /**
         * @internal
         */
        hasMention: PropTypes.bool,

        /**
         * Whether or not WebRtc is enabled.
         */
        enableWebrtc: PropTypes.bool.isRequired,

        ...Popover.propTypes,
    }

    static defaultProps = {
        isRHS: false,
        hasMention: false,
    }

    constructor(props) {
        super(props);

        this.initWebrtc = this.initWebrtc.bind(this);
        this.handleShowDirectChannel = this.handleShowDirectChannel.bind(this);
        this.handleMentionKeyClick = this.handleMentionKeyClick.bind(this);
        this.handleEditAccountSettings = this.handleEditAccountSettings.bind(this);
        this.state = {
            currentUserId: UserStore.getCurrentId(),
            loadingDMChannel: false,
        };
    }
    shouldComponentUpdate(nextProps) {
        if (!Utils.areObjectsEqual(nextProps.user, this.props.user)) {
            return true;
        }

        if (nextProps.src !== this.props.src) {
            return true;
        }

        if (nextProps.status !== this.props.status) {
            return true;
        }

        if (nextProps.isBusy !== this.props.isBusy) {
            return true;
        }

        // React-Bootstrap Forwarded Props from OverlayTrigger to Popover
        if (nextProps.arrowOffsetLeft !== this.props.arrowOffsetLeft) {
            return true;
        }

        if (nextProps.arrowOffsetTop !== this.props.arrowOffsetTop) {
            return true;
        }

        if (nextProps.positionLeft !== this.props.positionLeft) {
            return true;
        }

        if (nextProps.positionTop !== this.props.positionTop) {
            return true;
        }

        return false;
    }

    handleShowDirectChannel(e) {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }

        const user = this.props.user;

        if (this.state.loadingDMChannel) {
            return;
        }

        this.setState({loadingDMChannel: true});

        openDirectChannelToUser(
            user.id,
            () => {
                if (Utils.isMobile()) {
                    GlobalActions.emitCloseRightHandSide();
                }
                this.setState({loadingDMChannel: false});
                if (this.props.hide) {
                    this.props.hide();
                }
                browserHistory.push(`${TeamStore.getCurrentTeamRelativeUrl()}/messages/@${user.username}`);
            }
        );
    }

    initWebrtc() {
        if (this.props.status !== UserStatuses.OFFLINE && !WebrtcStore.isBusy()) {
            GlobalActions.emitCloseRightHandSide();
            WebrtcActions.initWebrtc(this.props.user.id, true);
        }
    }

    handleMentionKeyClick(e) {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }
        if (this.props.hide) {
            this.props.hide();
        }
        GlobalActions.emitPopoverMentionKeyClick(this.props.isRHS, this.props.user.username);
    }

    handleEditAccountSettings(e) {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }
        if (this.props.hide) {
            this.props.hide();
        }
        GlobalActions.showAccountSettingsModal();
    }

    render() {
        const popoverProps = Object.assign({}, this.props);
        delete popoverProps.user;
        delete popoverProps.src;
        delete popoverProps.status;
        delete popoverProps.isBusy;
        delete popoverProps.hide;
        delete popoverProps.isRHS;
        delete popoverProps.hasMention;
        delete popoverProps.dispatch;
        delete popoverProps.enableWebrtc;
        delete popoverProps.enableTimezone;

        const email = this.props.user.email;
        const username = this.props.user.username;
        var dataContent = [];
        var dataContentIcons = [];
        var showDirectChannel = this.props.user.id !== UserStore.getCurrentId();
        const fullname = Utils.getFullName(this.props.user);
        const firstname = this.props.user.first_name;
        if (fullname) {
            dataContent.push(
                <OverlayTrigger
                    key='user-popover-fullname-ot'
                    trigger={['hover', 'focus']}
                    delayShow={Constants.WEBRTC_TIME_DELAY}
                    placement='bottom'
                    overlay={(
                        <Tooltip id='whober_tooltip'>{`See ${firstname}'s whober profile`}</Tooltip>
                    )}
                >
                    <div
                        data-toggle='tooltip'
                        key='user-popover-fullname'
                        className='profile-popover-name'
                    >
                        <p
                            className='text-nowrap'
                        >
                            <a
                                href={`https://whober.uberinternal.com/${email}`}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {fullname}
                            </a>
                        </p>
                    </div>
                </OverlayTrigger>
            );
        }

        if (this.props.user.position) {
            dataContent.push(
                <OverlayTrigger
                    key='user-popover-position-ot'
                    delayShow={Constants.WEBRTC_TIME_DELAY}
                    placement='top'
                    overlay={<Tooltip id='positionTooltip'>{this.props.user.position}</Tooltip>}
                >
                    <div
                        className='overflow--ellipsis text-nowrap profile-popover-position'
                    >
                        {this.props.user.position}
                    </div>
                </OverlayTrigger>
            );
        }

        if (showDirectChannel) {
            dataContentIcons.push(
                <div
                    key='popover-dm-icon'
                    data-toggle='tooltip'
                    title={this.props.user.username}
                    className='pull-left profile-popover-icon'
                >
                    <a
                        onClick={this.handleShowDirectChannel.bind(this)}
                        href='#'
                    >
                        <img
                            width='32px'
                            height='32px'
                            src={dmIcon}
                        />
                    </a>
                </div>
            );
        }

        if (email) {
            dataContentIcons.push(
                <div
                    data-toggle='tooltip'
                    key='user-popover-dm'
                    title={`Email: ${email}`}
                    className='pull-left profile-popover-icon'
                >
                    <a
                        href={'mailto:' + email}
                    >
                        <img
                            width='32px'
                            height='32px'
                            src={emailIcon}
                        />
                    </a>
                </div>
            );
        }
        dataContentIcons.push(
            <div
                key='popover-calendar-icon'
                data-toggle='tooltip'
                title={`View calendar for: ${email}`}
                className='pull-left profile-popover-icon'
            >
                <a
                    href={`https://calendar.google.com/calendar/embed?src=${email}`}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <img
                        width='32px'
                        height='32px'
                        src={calendarIcon}
                    />
                </a>
            </div>
        );

        if (this.props.enableTimezone && this.props.user.timezone) {
            dataContent.push(
                <div
                    key='user-popover-local-time'
                    className='padding-bottom half'
                >
                    <FormattedMessage
                        id='user_profile.account.localTime'
                        defaultMessage='Local Time: '
                    />
                    <LocalDateTime userTimezone={this.props.user.timezone}/>
                </div>
            );
        }

        if (this.props.user.id === UserStore.getCurrentId()) {
            dataContentIcons.push(
                <div
                    data-toggle='tooltip'
                    key='user-popover-settings'
                    title='Edit Your Account'
                    className='pull-left profile-popover-icon'
                >
                    <a
                        href='#'
                        onClick={this.handleEditAccountSettings}
                    >
                        <i className='fa fa-pencil'/>
                    </a>
                </div>
            );
        }
        if (email || showDirectChannel) {
            dataContent.push(
                <div
                    key='popover-icons'
                    className='profile-popover-icons'
                    style={{width: `${56 * dataContentIcons.length}px`}}
                >
                    {dataContentIcons}
                </div>
            );
        }
        if (username && firstname) {
            dataContent.push(
                <OverlayTrigger
                    key='popover-username-ot'
                    trigger={['hover', 'focus']}
                    delayShow={1000}
                    placement='right'
                    overlay={(
                        <Tooltip id='user_mention'>{`Mention to ${firstname}`}</Tooltip>
                    )}
                >
                    <button
                        className='btn btn-primary username-btn'
                        onClick={this.handleMentionKeyClick}
                        key='popover-username-btn'
                    >
                        {'@' + username}
                    </button>
                </OverlayTrigger>
            );
        }

        return (
            <Popover
                {...popoverProps}
                title={'@' + this.props.user.username}
                id='user-profile-popover-new'
            >
                <div className='profile-popover-container'>
                    <img
                        className='user-popover__image'
                        src={this.props.src}
                        height='100'
                        width='100'
                        key='user-popover-image'
                    />
                    {dataContent}
                </div>
            </Popover>
        );
    }
}

delete ProfilePopoverUchat.propTypes.id;

export default ProfilePopoverUchat;
