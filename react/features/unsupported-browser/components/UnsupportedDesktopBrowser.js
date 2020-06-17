/* @flow */

import React, { Component } from 'react';

import { isBrowsersOptimal } from '../../base/environment';
import { translate } from '../../base/i18n';

import { CHROME, FIREFOX } from './browserLinks';

/**
 * The namespace of the CSS styles of UnsupportedDesktopBrowser.
 *
 * @private
 * @type {string}
 */
const _SNS = 'unsupported-desktop-browser';

/**
 * The type of the React {@code Component} props of
 * {@link UnsupportedDesktopBrowser}.
 */
type Props = {

    /**
     * The function to translate human-readable text.
     */
    t: Function
};

/**
 * React component representing unsupported browser page.
 *
 * @class UnsupportedDesktopBrowser
 */
class UnsupportedDesktopBrowser extends Component<Props> {
    /**
     * Renders the component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <div className = { _SNS }>
                <h2 className = { `${_SNS}__title` }>
		    You don't have permission to access via browsers
                </h2>
            </div>
        );
    }

    /**
     * Returns whether or not a link to download Firefox is displayed.
     *
     * @private
     * @returns {boolean}
     */
    _showFirefox() {
        return isBrowsersOptimal('firefox');
    }
}

export default translate(UnsupportedDesktopBrowser);
