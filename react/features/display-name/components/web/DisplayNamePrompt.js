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

import { setPassword } from '../../../base/conference';

import {
    isLocalParticipantModerator,
    getLocalParticipant
} from '../../../base/participants';

import { updateSettings } from '../../../base/settings';

/**
 * The type of the React {@code Component} props of {@link DisplayNamePrompt}.
 */
type State = {
    /**
     * The name to show in the display name text field.
     */
    displayName: string,

    /**
     * Whether or not to show the password in editing mode.
     */
    passwordEditEnabled: boolean
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
            displayName: (props._localParticipantName) ? props._localParticipantName : '',
            enteredPassword: '',
            passwordEditEnabled: true,
            startWithVideoMuted: props._settings.startWithVideoMuted
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onStartWithVideoMuted = this._onStartWithVideoMuted.bind(this);
        this._onEnteredPasswordChange = this._onEnteredPasswordChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onPasswordRemove = this._onPasswordRemove.bind(this);
        this._onPasswordSubmit = this._onPasswordSubmit.bind(this);
        this._onTogglePasswordEditState
            = this._onTogglePasswordEditState.bind(this);
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
                {(this.props._canEditPassword) &&  
                    <div className = 'info-dialog-password'>
                        <TextField
                            required
                            autoFocus = { true }
                            compact = { true }
                            label = { this.props.t('dialog.enterPasswordRoom') }
                            name = 'passwordRoom'
                            shouldFitContainer = { true }
                            className = 'info-password-input'
                            maxLength = { this.props._passwordNumberOfDigits }
                            onChange = { this._onEnteredPasswordChange }
                            pattern = { digitPattern }
                            placeholder = { placeHolderText }
                            spellCheck = { 'false' }
                            type = 'text'
                            value = { this.state.enteredPassword }  />
                    </div>
                }
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

    _onEnteredPasswordChange: (Object) => void;

    /**
     * Updates the internal state of entered password.
     *
     * @param {Object} event - DOM Event for value change.
     * @private
     * @returns {void}
     */
    _onEnteredPasswordChange(event) {
        this.setState({ enteredPassword: event.target.value });
    }

    _onStartWithVideoMuted: (Object) => void;

    /**
     * Updates the internal state of entered password.
     *
     * @param {Object} event - DOM Event for value change.
     * @private
     * @returns {void}
     */
    _onStartWithVideoMuted(event) {
        this.setState({ startWithVideoMuted: event.target.checked });
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
        const { _conference, _locked, _tracks } = this.props;
        let startWithVideoMuted = this.state.startWithVideoMuted

        this.props.dispatch(updateSettings({
            startWithVideoMuted
        }));

        APP.conference.muteVideo(startWithVideoMuted)

        !_locked && this.props.dispatch(setPassword(
            _conference,
            _conference.lock,
            this.state.enteredPassword
        ));

        if(this.state.enteredPassword == ''){
            return false;
        } else {
            return this._onSetDisplayName(this.state.displayName);
        }        
    }

    _onCancel: () => boolean;

    _onCancel() {
        return this.props.dispatch(disconnect(false));
    }


    _onPasswordRemove: () => void;

    /**
     * Callback invoked to unlock the current JitsiConference.
     *
     * @private
     * @returns {void}
     */
    _onPasswordRemove() {
        this._onPasswordSubmit('');
    }

    _onPasswordSubmit: (string) => void;

    /**
     * Callback invoked to set a password on the current JitsiConference.
     *
     * @param {string} enteredPassword - The new password to be used to lock the
     * current JitsiConference.
     * @private
     * @returns {void}
     */
    _onPasswordSubmit(enteredPassword) {
        const { _conference } = this.props;

        this.props.dispatch(setPassword(
            _conference,
            _conference.lock,
            enteredPassword
        ));
    }

    _onTogglePasswordEditState: () => void;

    /**
     * Toggles whether or not the password should currently be shown as being
     * edited locally.
     *
     * @private
     * @returns {void}
     */
    _onTogglePasswordEditState() {
        this.setState({
            passwordEditEnabled: !this.state.passwordEditEnabled
        });
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code InfoDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
    *     _canEditPassword: boolean,
    *     _conference: Object,
    *     _conferenceName: string,
    *     _inviteURL: string,
    *     _localParticipantName: ?string,
    *     _locationURL: string,
    *     _locked: string,
    *     _password: string
    * }}
    */
   function _mapStateToProps(state) {
       const {
           conference,
           locked,
           password,
           room
       } = state['features/base/conference'];
       const localParticipant = getLocalParticipant(state);
   
       return {
           _canEditPassword: isLocalParticipantModerator(state, state['features/base/config'].lockRoomGuestEnabled),
           _conference: conference,
           _conferenceName: room,
           _passwordNumberOfDigits: state['features/base/config'].roomPasswordNumberOfDigits,
           _localParticipantName: localParticipant?.name,
           _locked: locked,
           _password: password,
           _settings: state['features/base/settings']
       };
   }
export default translate(connect(_mapStateToProps)(DisplayNamePrompt));
