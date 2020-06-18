import React, { Component } from 'react';

import { isBrowsersOptimal } from '../../base/environment';
import { translate } from '../../base/i18n';

/**
 * React component representing unsupported browser page.
 *
 * @class UnsupportedDesktopBrowser
 */
class BlankPage extends Component<Props> {
    /**
     * Renders the component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <div className='unsupported-desktop-browser'>
                <h2 className = 'unsupported-desktop-browser__title'>
		            You don't have permission to access via browsers
                </h2>
            </div>
        );
    }
}

export default translate(BlankPage);