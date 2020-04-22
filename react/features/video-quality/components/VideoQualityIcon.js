// @flow

import React, { Component } from 'react';

import { VIDEO_QUALITY_LEVELS } from '../../base/conference';
import { translate } from '../../base/i18n';
import {
    Icon,
    IconVideoQualityAudioOnly,
    IconVideoQualityHD,
    IconVideoQualityLD,
    IconVideoQualitySD
} from '../../base/icons';
import { connect } from '../../base/redux';

/**
 * A map of of selectable receive resolutions to corresponding icons.
 *
 * @private
 * @type {Object}
 */
const VIDEO_QUALITY_TO_ICON = {
    [VIDEO_QUALITY_LEVELS.HIGH]: IconVideoQualityHD,
    [VIDEO_QUALITY_LEVELS.STANDARD]: IconVideoQualitySD,
    [VIDEO_QUALITY_LEVELS.LOW]: IconVideoQualityLD
};

/**
 * The type of the React {@code Component} props of
 * {@link MenuVideoQualityIcon}.
 */
type Props = {

    /**
     * Whether or not audio only mode is currently enabled.
     */
    _audioOnly: boolean,

    /**
     * The currently configured maximum quality resolution to be received from
     * remote participants.
     */
    _receiverVideoQuality: number,

    /**
     * Callback to invoke when {@link MenuVideoQualityIcon} is clicked.
     */
    onClick: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * React {@code Component} responsible for displaying a button in the overflow
 * menu of the toolbar, including an icon showing the currently selected
 * max receive quality.
 *
 * @extends Component
 */
class MenuVideoQualityIcon extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _audioOnly, _receiverVideoQuality } = this.props;
        const icon = _audioOnly || !_receiverVideoQuality
            ? IconVideoQualityAudioOnly
            : VIDEO_QUALITY_TO_ICON[_receiverVideoQuality];

        return (
                <span 
                className = 'toolbox-button-wth-dialog'
                onClick = { this.props.onClick }>
                    <div className= 'toolbox-button'>
                        <div className='toolbox-icon '>
                        <Icon src = { icon } />
                        </div>
                    </div>
                </span>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code MenuVideoQualityIcon} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _receiverVideoQuality: number
 * }}
 */
function _mapStateToProps(state) {
    return {
        _audioOnly: state['features/base/audio-only'].enabled,
        _receiverVideoQuality:
            state['features/base/conference'].preferredReceiverVideoQuality
    };
}

export default translate(
    connect(_mapStateToProps)(MenuVideoQualityIcon));
