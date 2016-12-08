// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Popover, Tooltip} from 'react-bootstrap';
import {browserHistory} from 'react-router/es6';

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

export default class ProfilePopoverNew extends React.Component {
    static getComponentName() {
        return 'ProfilePopoverNew';
    }

    constructor(props) {
        super(props);

        this.initWebrtc = this.initWebrtc.bind(this);
        this.handleShowDirectChannel = this.handleShowDirectChannel.bind(this);
        this.handleMentionKeyClick = this.handleMentionKeyClick.bind(this);
        this.state = {
            currentUserId: UserStore.getCurrentId(),
            loadingDMChannel: false
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
            (channel) => {
                if (Utils.isMobile()) {
                    GlobalActions.emitCloseRightHandSide();
                }
                this.setState({loadingDMChannel: false});
                if (this.props.hide) {
                    this.props.hide();
                }
                browserHistory.push(TeamStore.getCurrentTeamRelativeUrl() + '/channels/' + channel.name);
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

    render() {
        const popoverProps = Object.assign({}, this.props);
        delete popoverProps.user;
        delete popoverProps.src;
        delete popoverProps.parent;
        delete popoverProps.status;
        delete popoverProps.isBusy;
        delete popoverProps.hide;
        delete popoverProps.isRHS;
        delete popoverProps.hasMention;

        const email = this.props.user.email;
        const username = this.props.user.username;
        var dataContent = [];
        var dataContentIcons = [];
        var showEmail = global.window.mm_config.ShowEmailAddress === 'true' || UserStore.isSystemAdminForCurrentUser() || this.props.user.id === UserStore.getCurrentId();
        var showDirectChannel = this.props.user.id !== UserStore.getCurrentId();
        const fullname = Utils.getFullName(this.props.user);
        const firstname = this.props.user.first_name;
        if (fullname) {
            dataContent.push(
                <OverlayTrigger
                    key='user-popover-fullname-ot'
                    trigger={['hover', 'focus']}
                    delayShow={300}
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
        if (showEmail) {
            dataContentIcons.push(
                <div
                    data-toggle='tooltip'
                    key='user-popover-dm'
                    title={email}
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
                title={email}
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
        if (showEmail || showDirectChannel) {
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

ProfilePopoverNew.defaultProps = {
    isRHS: false,
    hasMention: false
};

ProfilePopoverNew.propTypes = Object.assign({
    src: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    status: PropTypes.string,
    isBusy: PropTypes.bool,
    hide: PropTypes.func,
    isRHS: PropTypes.bool,
    hasMention: PropTypes.bool,
    parent: PropTypes.object
}, Popover.propTypes);
delete ProfilePopoverNew.propTypes.id;
