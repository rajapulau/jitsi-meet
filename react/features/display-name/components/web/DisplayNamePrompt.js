/* @flow */

import React from 'react';
import { FieldTextStateless as TextField } from '@atlaskit/field-text';
import { Checkbox } from '@atlaskit/checkbox';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { disconnect } from '../../../base/connection';

import AbstractDisplayNamePrompt, {
    type Props
} from '../AbstractDisplayNamePrompt';

/**
 * The type of the React {@code Component} props of {@link DisplayNamePrompt}.
 */
type State = {

    /**
     * The name to show in the display name text field.
     */
    displayName: string
};

/**
 * Implements a React {@code Component} for displaying a dialog with an field
 * for setting the local participant's display name.
 *
 * @extends Component
 */
class DisplayNamePrompt extends AbstractDisplayNamePrompt<State> {
    /**
     * Initializes a new {@code DisplayNamePrompt} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            displayName: ''
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onStartWithVideoMuted = this._onStartWithVideoMuted.bind(this);
        this._onEnteredPasswordChange = this._onEnteredPasswordChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let digitPattern, placeHolderText;

        if (this.props.passwordNumberOfDigits) {
            placeHolderText = this.props.t('passwordDigitsOnly', {
                number: this.props.passwordNumberOfDigits });
            digitPattern = '\\d*';
        }

        return (
            <Dialog
                isModal = { false }
                onSubmit = { this._onSubmit }
                onCancel = { this._onCancel }
                titleKey = 'dialog.displayNameRequired'
                width = 'small'>
                <Checkbox
                    isChecked = { this.state.startWithVideoMuted }
                    label = { this.props.t('settings.startWithAudioOnly') }
                    name = 'start-video-muted'
                    onChange = { this._onStartWithVideoMuted }
                     />

                <TextField
                    required
                    autoFocus = { true }
                    compact = { true }
                    label = { this.props.t('dialog.enterDisplayName') }
                    name = 'displayName'
                    onChange = { this._onDisplayNameChange }
                    shouldFitContainer = { true }
                    type = 'text'
                    value = { this.state.displayName } />
            </Dialog>);
    }

    _onDisplayNameChange: (Object) => void;

    /**
     * Updates the entered display name.
     *
     * @param {Object} event - The DOM event triggered from the entered display
     * name value having changed.
     * @private
     * @returns {void}
     */
    _onDisplayNameChange(event) {
        this.setState({
            displayName: event.target.value
        });
    }

    _onSetDisplayName: string => boolean;

    _onSubmit: () => boolean;

    /**
     * Dispatches an action to update the local participant's display name. A
     * name must be entered for the action to dispatch.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit() {
        return this._onSetDisplayName(this.state.displayName);
    }
}

export default translate(connect()(DisplayNamePrompt));
