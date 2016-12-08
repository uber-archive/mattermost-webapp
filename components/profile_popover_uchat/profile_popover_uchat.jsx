// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Popover, Tooltip} from 'react-bootstrap';
import {intlShape, injectIntl} from 'react-intl';

import EventEmitter from 'mattermost-redux/utils/event_emitter';

import LocalDateTime from 'components/local_date_time';
import UserSettingsModal from 'components/user_settings/modal';
import {browserHistory} from 'utils/browser_history';
import * as GlobalActions from 'actions/global_actions.jsx';
import Constants, {ModalIdentifiers, UserStatuses} from 'utils/constants.jsx';
import * as Utils from 'utils/utils.jsx';
import Pluggable from 'plugins/pluggable';

import emailIcon from 'images/icons/email_cta.png';
import dmIcon from 'images/icons/dm_cta.png';
import calendarIcon from 'images/icons/calendar_cta.png';

/**
 * The profile popover, or hovercard, that appears with user information when clicking
 * on the username or profile picture of a user.
 */
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
        user: PropTypes.object,

        /**
         * The bot this profile picture is being opened for (if bot)
         */
        bot: PropTypes.object,

        /**
         * Status for the user, either 'offline', 'away', 'dnd' or 'online'
         */
        status: PropTypes.string,

        hideStatus: PropTypes.bool,

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
         * @internal
         */
        currentUserId: PropTypes.string.isRequired,

        /**
         * @internal
         */
        teamUrl: PropTypes.string.isRequired,

        /**
         * @internal
         */
        isTeamAdmin: PropTypes.bool.isRequired,

        /**
         * @internal
         */
        isChannelAdmin: PropTypes.bool.isRequired,

        /**
         * @internal
         */
        actions: PropTypes.shape({
            getMembershipForCurrentEntities: PropTypes.func.isRequired,
            openDirectChannelToUserId: PropTypes.func.isRequired,
            openModal: PropTypes.func.isRequired,
            loadBot: PropTypes.func.isRequired,
        }).isRequired,

        /**
         * react-intl helper object
         */
        intl: intlShape.isRequired,

        ...Popover.propTypes,
    }

    static defaultProps = {
        isRHS: false,
        hasMention: false,
        status: UserStatuses.OFFLINE,
    }

    constructor(props) {
        super(props);

        this.handleShowDirectChannel = this.handleShowDirectChannel.bind(this);
        this.handleMentionKeyClick = this.handleMentionKeyClick.bind(this);
        this.handleEditAccountSettings = this.handleEditAccountSettings.bind(this);
        this.state = {
            loadingDMChannel: -1,
        };
    }

    componentDidMount() {
        this.props.actions.getMembershipForCurrentEntities(this.props.userId);
        this.props.actions.loadBot(this.props.userId);
    }

    handleShowDirectChannel(e) {
        const {actions} = this.props;
        e.preventDefault();

        if (!this.props.user) {
            return;
        }

        const user = this.props.user;

        if (this.state.loadingDMChannel !== -1) {
            return;
        }

        this.setState({loadingDMChannel: user.id});

        actions.openDirectChannelToUserId(user.id).then((result) => {
            if (!result.error) {
                if (Utils.isMobile()) {
                    GlobalActions.emitCloseRightHandSide();
                }
                this.setState({loadingDMChannel: -1});
                if (this.props.hide) {
                    this.props.hide();
                }
                browserHistory.push(`${this.props.teamUrl}/messages/@${user.username}`);
            }
        });
    }

    handleMentionKeyClick(e) {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }
        if (this.props.hide) {
            this.props.hide();
        }
        EventEmitter.emit('mention_key_click', this.props.user.username, this.props.isRHS);
    }

    handleEditAccountSettings(e) {
        e.preventDefault();

        if (!this.props.user) {
            return;
        }
        if (this.props.hide) {
            this.props.hide();
        }
        this.props.actions.openModal({ModalId: ModalIdentifiers.USER_SETTINGS, dialogType: UserSettingsModal});
    }

    render() {
        if (!this.props.user) {
            return null;
        }

        const popoverProps = Object.assign({}, this.props);
        delete popoverProps.user;
        delete popoverProps.userId;
        delete popoverProps.src;
        delete popoverProps.status;
        delete popoverProps.hideStatus;
        delete popoverProps.isBusy;
        delete popoverProps.hide;
        delete popoverProps.isRHS;
        delete popoverProps.hasMention;
        delete popoverProps.dispatch;
        delete popoverProps.enableTimezone;
        delete popoverProps.currentUserId;
        delete popoverProps.teamUrl;
        delete popoverProps.actions;
        delete popoverProps.isTeamAdmin;
        delete popoverProps.isChannelAdmin;
        delete popoverProps.intl;

        const {formatMessage} = this.props.intl;

        const email = this.props.user.email;
        const username = this.props.user.username;
        var dataContent = [];
        var dataContentIcons = [];
        const fullname = Utils.getFullName(this.props.user);
        const firstname = this.props.user.first_name;
        if (fullname) {
            dataContent.push(
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='bottom'
                    overlay={(
                        <Tooltip id='fullNameTooltip'>{`See ${firstname}'s whober profile`}</Tooltip>
                    )}
                    key='user-popover-fullname'
                >
                    <div
                        data-toggle='tooltip'
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

        if (this.props.user.is_bot && this.props.bot) {
            dataContent.push(
                <div
                    key='bot-description'
                    className='overflow--ellipsis text-nowrap'
                >
                    {this.props.bot.description}
                </div>
            );
        }

        if (this.props.user.position) {
            dataContent.push(
                <OverlayTrigger
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='top'
                    overlay={<Tooltip id='positionTooltip'>{this.props.user.position}</Tooltip>}
                    key='user-popover-position'
                >
                    <div
                        className='overflow--ellipsis text-nowrap padding-bottom padding-top half'
                    >
                        {this.props.user.position}
                    </div>
                </OverlayTrigger>
            );
        }

        if (this.props.user.id !== this.props.currentUserId) {
            dataContentIcons.push(
                <div
                    key='popover-dm-icon'
                    data-toggle='tooltip'
                    title={this.props.user.username}
                    className='pull-left profile-popover-icon'
                >
                    <a
                        onClick={this.handleShowDirectChannel}
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

        dataContent.push(
            <Pluggable
                key='profilePopoverPluggable2'
                pluggableName='PopoverUserAttributes'
                user={this.props.user}
                status={this.props.hideStatus ? null : this.props.status}
            />
        );
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
                    className='padding-bottom half profile-popover-timezone'
                >
                    <LocalDateTime userTimezone={this.props.user.timezone}/>
                </div>
            );
        }

        if (this.props.user.id === this.props.currentUserId) {
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
                        <i
                            className='fa fa-pencil'
                            title={formatMessage({id: 'generic_icons.edit', defaultMessage: 'Edit Icon'})}
                        />
                    </a>
                </div>
            );
        }
        if (email || this.props.user.id !== this.props.currentUserId) {
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

        dataContent.push(
            <Pluggable
                key='profilePopoverPluggable3'
                pluggableName='PopoverUserActions'
                user={this.props.user}
                status={this.props.hideStatus ? null : this.props.status}
            />
        );

        let roleTitle;
        if (this.props.user.is_bot) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('bots.is_bot', 'BOT')}</span>;
        } else if (Utils.isSystemAdmin(this.props.user.roles)) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('admin.permissions.roles.system_admin.name', 'System Admin')}</span>;
        } else if (this.props.isTeamAdmin) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('admin.permissions.roles.team_admin.name', 'Team Admin')}</span>;
        } else if (this.props.isChannelAdmin) {
            roleTitle = <span className='user-popover__role'>{Utils.localizeMessage('admin.permissions.roles.channel_admin.name', 'Channel Admin')}</span>;
        }

        let title = `@${this.props.user.username}`;
        if (this.props.hasMention) {
            title = <a onClick={this.handleMentionKeyClick}>{title}</a>;
        }
        title = (
            <span>
                <span className='user-popover__username'>
                    {title}
                </span>
                {roleTitle}
            </span>
        );

        return (
            <Popover
                {...popoverProps}
                title={title}
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

export default injectIntl(ProfilePopoverUchat);
