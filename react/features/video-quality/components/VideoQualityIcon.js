// @flow

import React, { Component } from 'react';

import { VIDEO_QUALITY_LEVELS } from '../../base/conference';
import { isMobileBrowser } from '../../base/environment/utils';
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
 * {@link VideoQualityIcon}.
 */
type Props = {

    /**
     * Whether or not audio only mode is currently enabled.
     */
    _audioOnly: boolean,

    /**
     * The currently configured maximum quality resolution to be received from
     * and sent to remote participants.
     */
    _videoQuality: number,

    /**
     * Callback to invoke when {@link VideoQualityIcon} is clicked.
     */
    onClick: Function,

    /**
     * Flag controlling the visibility of the button.
     * AudioSettings popup is disabled on mobile browsers.
     */
    visible: boolean,

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
class VideoQualityIcon extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _audioOnly, _videoQuality, visible } = this.props;
        const icon = _audioOnly || !_videoQuality
            ? IconVideoQualityAudioOnly
            : VIDEO_QUALITY_TO_ICON[_videoQuality];

            return visible ? (
                <span 
                    className = 'toolbox-button-wth-dialog'
                    onClick = { this.props.onClick }>
                    <div className= 'toolbox-button'>
                        <div className='toolbox-icon '>
                        <Icon src = { icon } />
                        </div>
                    </div>
                </span>
            ):'';
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code VideoQualityIcon} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _videoQuality: number
 * }}
 */
function _mapStateToProps(state) {
    return {
        _audioOnly: state['features/base/audio-only'].enabled,
        _videoQuality: state['features/base/conference'].preferredVideoQuality,
        visible: !isMobileBrowser()
    };
}

export default translate(
    connect(_mapStateToProps)(VideoQualityIcon));
