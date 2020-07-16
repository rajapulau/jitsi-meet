// @flow

import React from 'react';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractGrantModeratorDialog
    from '../AbstractGrantModeratorDialog';

/**
 * Dialog to confirm a grant moderator action.
 */
class GrantModeratorDialog extends AbstractGrantModeratorDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isModerator } = this.props;

        return (
            <Dialog
                okKey = 'dialog.Yes'
                onSubmit = { this._onSubmit }
                titleKey = { this.props.t((!isModerator)?'dialog.grantModeratorTitle':'dialog.removeModeratorTitle') }
                width = 'small'>
                <div>
                    { this.props.t((!isModerator)?'dialog.grantModeratorDialog':'dialog.removeModeratorDialog') }
                </div>
            </Dialog>
        );
    }

    _onSubmit: () => boolean;
}

export default translate(connect()(GrantModeratorDialog));
