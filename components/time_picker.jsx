// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

export default class TimePicker extends React.PureComponent {
    static proptypes = {
        keyValue: PropTypes.string,
        defaultValue: PropTypes.string,
        submit: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.state = {
            // eslint-disable-next-line react/prop-types
            selectedOption: {value: this.props.defaultValue, label: this.props.defaultValue},
        };
    }
    async onSelectChange(selectedOption) {
        this.setState({selectedOption}, async () => {
            // eslint-disable-next-line react/prop-types
            await this.props.submit(this.props.keyValue, selectedOption.label);
        });
    }

    render() {
        // eslint-disable-next-line react/prop-types
        var options = this.props.options;
        return (
            <Select
                value={this.state.selectedOption}
                styles={customStyles}
                onChange={this.onSelectChange}
                options={options}
            />
        );
    }
}

const customStyles = {
    control: (base) => ({
        ...base,
        width: '150px',
        minHeight: '10px',
        textAlign: 'center',
    }),
};

