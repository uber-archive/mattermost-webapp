
// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedDate, FormattedTime, injectIntl, intlShape, defineMessages} from 'react-intl';

import {createJob, cancelJob} from 'actions/job_actions.jsx';
import {JobTypes, JobStatuses} from 'utils/constants.jsx';
import ErrorStore from 'stores/error_store.jsx';

const holders = defineMessages({
    jobId: {
        id: 'admin.jobTable.jobId',
        defaultMessage: 'Job ID: '
    },
    lastActivityAt: {
        id: 'admin.jobTable.lastActivityAt',
        defaultMessage: 'Last Activity: '
    },
    runLengthSeconds: {
        id: 'admin.jobTable.runLengthSeconds',
        defaultMessage: ' seconds'
    },
    runLengthMinutes: {
        id: 'admin.jobTable.runLengthMinutes',
        defaultMessage: ' minutes'
    },
    cancelButton: {
        id: 'admin.jobTable.cancelButton',
        defaultMessage: 'Cancel'
    }
});

class JobTable extends React.PureComponent {

    static propTypes = {
        intl: intlShape.isRequired,
        jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
        actions: PropTypes.shape({
            getJobsByType: PropTypes.func.isRequired
        }).isRequired,
        getExtraInfoText: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        createJobHelpText: PropTypes.element.isRequired,
        createJobButtonText: PropTypes.element.isRequired
    };

    constructor(props) {
        super(props);
        this.interval = null;

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        this.interval = setInterval(this.reload, 15000);
    }

    componentDidMount() {
        this.props.actions.getJobsByType(JobTypes.LDAP_SYNC).then(
            () => this.setState({loading: false})
         );
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    getStatus = (job) => {
        if (job.status === JobStatuses.PENDING) {
            return (
                <span
                    className='status-icon-warning'
                    title={this.props.intl.formatMessage(holders.jobId) + job.id}
                >
                    <FormattedMessage
                        id='admin.jobTable.statusPending'
                        defaultMessage='Pending'
                    />
                </span>
            );
        } else if (job.status === JobStatuses.IN_PROGRESS) {
            return (
                <span
                    className='status-icon-warning'
                    title={this.props.intl.formatMessage(holders.jobId) + job.id}
                >
                    <FormattedMessage
                        id='admin.jobTable.statusInProgress'
                        defaultMessage='In Progress'
                    />
                </span>
            );
        } else if (job.status === JobStatuses.SUCCESS) {
            return (
                <span
                    className='status-icon-success'
                    title={this.props.intl.formatMessage(holders.jobId) + job.id}
                >
                    <FormattedMessage
                        id='admin.jobTable.statusSuccess'
                        defaultMessage='Success'
                    />
                </span>
            );
        } else if (job.status === JobStatuses.ERROR) {
            return (
                <span
                    className='status-icon-error'
                    title={this.props.intl.formatMessage(holders.jobId) + job.id}
                >
                    <FormattedMessage
                        id='admin.jobTable.statusError'
                        defaultMessage='Error'
                    />
                </span>
            );
        } else if (job.status === JobStatuses.CANCEL_REQUESTED) {
            return (
                <span
                    className='status-icon-warning'
                    title={this.props.intl.formatMessage(holders.jobId) + job.id}
                >
                    <FormattedMessage
                        id='admin.jobTable.statusCanceling'
                        defaultMessage='Canceling...'
                    />
                </span>
            );
        } else if (job.status === JobStatuses.CANCELED) {
            return (
                <span
                    className='status-icon-error'
                    title={this.props.intl.formatMessage(holders.jobId) + job.id}
                >
                    <FormattedMessage
                        id='admin.jobTable.statusCanceled'
                        defaultMessage='Canceled'
                    />
                </span>
            );
        }

        return (
            <span title={this.props.intl.formatMessage(holders.jobId) + job.id}>{job.status}</span>
        );
    }

    getExtraInfoText = (job) => {
        if (job.data && job.data.error && job.data.error.length > 0) {
            return <span title={job.data.error}>{job.data.error}</span>;
        }

        if (this.props.getExtraInfoText) {
            return this.props.getExtraInfoText(job);
        }

        return <span/>;
    }

    getRunLength = (job) => {
        let millis = job.last_activity_at - job.start_at;
        if (job.status === JobStatuses.IN_PROGRESS) {
            const runningMillis = Date.now() - job.start_at;
            if (runningMillis > millis) {
                millis = runningMillis;
            }
        }

        let lastActivity = this.props.intl.formatMessage(holders.lastActivityAt) + '--';

        if (job.last_activity_at > 0) {
            lastActivity = this.props.intl.formatMessage(holders.lastActivityAt) +
                this.props.intl.formatDate(new Date(job.last_activity_at), {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                }) + ' - ' +
                this.props.intl.formatTime(new Date(job.last_activity_at), {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
        }

        var seconds = Math.round(millis / 1000);
        var minutes = Math.round(millis / (1000 * 60));

        if (millis <= 0 || job.status === JobStatuses.CANCELED) {
            return (
                <span style={{whiteSpace: 'nowrap'}}>{'--'}</span>
            );
        }

        if (seconds <= 120) {
            return (
                <span
                    style={{whiteSpace: 'nowrap'}}
                    title={lastActivity}
                >
                    {seconds + this.props.intl.formatMessage(holders.runLengthSeconds)}
                </span>
            );
        }

        return (
            <span
                style={{whiteSpace: 'nowrap'}}
                title={lastActivity}
            >
                {minutes + this.props.intl.formatMessage(holders.runLengthMinutes)}
            </span>
        );
    }

    getFinishAt = (status, millis) => {
        if (millis === 0 || status === JobStatuses.PENDING || status === JobStatuses.IN_PROGRESS || status === JobStatuses.CANCEL_REQUESTED) {
            return (
                <span style={{whiteSpace: 'nowrap'}}>{'--'}</span>
            );
        }

        const date = new Date(millis);
        return (
            <span style={{whiteSpace: 'nowrap'}}>
                <FormattedDate
                    value={date}
                    day='2-digit'
                    month='short'
                    year='numeric'
                />
                {' - '}
                <FormattedTime
                    value={date}
                    hour='2-digit'
                    minute='2-digit'
                />
            </span>
        );
    }

    reload = () => {
        this.setState({loading: true});

        this.props.actions.getJobsByType(JobTypes.LDAP_SYNC).then(
            () => {
                this.setState({
                    loading: false
                });
            }
        );
    };

    handleCancelJob = (e, job) => {
        e.preventDefault();

        cancelJob(
            job.id,
            () => {
                this.reload();
            },
            (err) => {
                ErrorStore.storeLastError(err);
                ErrorStore.emitChange();
                this.reload();
            }
        );
    };

    handleCreateJob = (e) => {
        e.preventDefault();

        const job = {
            type: JobTypes.LDAP_SYNC
        };

        createJob(
            job,
            () => {
                this.reload();
            },
            (err) => {
                ErrorStore.storeLastError(err);
                ErrorStore.emitChange();
                this.reload();
            }
        );
    };

    getCancelButton = (job) => {
        let cancelButton = null;

        if (!this.props.disabled && (job.status === JobStatuses.PENDING || job.status === JobStatuses.IN_PROGRESS)) {
            cancelButton = (
                <span
                    onClick={(e) => this.handleCancelJob(e, job)}
                    className='job-table__cancel'
                    title={this.props.intl.formatMessage(holders.cancelButton)}
                >
                    {'×'}
                </span>
            );
        }

        return cancelButton;
    }

    render() {
        var items = this.props.jobs.map((job) => {
            return (
                <tr key={job.id}>
                    <td style={{whiteSpace: 'nowrap'}}>{this.getCancelButton(job)}</td>
                    <td style={{whiteSpace: 'nowrap'}}>{this.getStatus(job)}</td>
                    <td style={{whiteSpace: 'nowrap'}}>{this.getFinishAt(job.status, job.last_activity_at)}</td>
                    <td style={{whiteSpace: 'nowrap'}}>{this.getRunLength(job)}</td>
                    <td colSpan='3'>{this.getExtraInfoText(job)}</td>
                </tr>
            );
        });

        return (
            <div
                style={{
                    margin: '10px',
                    marginBottom: '50px',
                    marginLeft: '20px'
                }}
            >
                <div
                    className='form-group'
                    style={{
                        marginLeft: '10px'
                    }}
                >
                    <div>
                        <div>
                            <button
                                className='btn btn-default'
                                onClick={this.handleCreateJob}
                                disabled={this.props.disabled}
                            >
                                {this.props.createJobButtonText}
                            </button>
                        </div>
                        <div className='help-text'>
                            {this.props.createJobHelpText}
                        </div>
                    </div>
                </div>
                <div
                    className='jobs-panel__table'
                >
                    <table className='table'>
                        <thead>
                            <tr>
                                <th/>
                                <th>
                                    <FormattedMessage
                                        id='admin.jobTable.headerStatus'
                                        defaultMessage='Status'
                                    />
                                </th>
                                <th>
                                    <FormattedMessage
                                        id='admin.jobTable.headerFinishAt'
                                        defaultMessage='Finish At'
                                    />
                                </th>
                                <th>
                                    <FormattedMessage
                                        id='admin.jobTable.headerRunTime'
                                        defaultMessage='Run Time'
                                    />
                                </th>
                                <th colSpan='3'>
                                    <FormattedMessage
                                        id='admin.jobTable.headerExtraInfo'
                                        defaultMessage='Extra Information'
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default injectIntl(JobTable);
