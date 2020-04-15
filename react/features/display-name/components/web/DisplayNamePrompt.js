/* @flow */

import React from 'react';
import { FieldTextStateless as TextField } from '@atlaskit/field-text';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';

import AbstractDisplayNamePrompt, {
    type Props
} from '../AbstractDisplayNamePrompt';

import { setPassword } from '../../../base/conference';

import {
    isLocalParticipantModerator,
    getLocalParticipant
} from '../../../base/participants';

import PasswordForm from '../../../invite/components/info-dialog/web/PasswordForm';

/**
 * The type of the React {@code Component} props of {@link InfoDialog}.
 */
// type Props = {

//     /**
//      * Whether or not the current user can modify the current password.
//      */
//     _canEditPassword: boolean,

//     /**
//      * The JitsiConference for which to display a lock state and change the
//      * password.
//      */
//     _conference: Object,

//     /**
//      * The name of the current conference. Used as part of inviting users.
//      */
//     _conferenceName: string,

//      /**
//      * The redux representation of the local participant.
//      */
//     _localParticipantName: ?string,

//     /**
//      * The value for how the conference is locked (or undefined if not locked)
//      * as defined by room-lock constants.
//      */
//     _locked: string,

//     /**
//      * The current known password for the JitsiConference.
//      */
//     _password: string,

//     /**
//      * The number of digits to be used in the password.
//      */
//     _passwordNumberOfDigits: ?number,

//     /**
//      * Invoked to open a dialog for adding participants to the conference.
//      */
//     dispatch: Dispatch<any>

// };

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
            passwordConf: '',
            passwordEditEnabled: true
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
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
        return (
            <Dialog
                isModal = { false }
                onSubmit = { this._onSubmit }
                titleKey = 'dialog.displayNameRequired'
                width = 'small'>
                <TextField
                    autoFocus = { true }
                    compact = { true }
                    label = { this.props.t('dialog.enterDisplayName') }
                    name = 'displayName'
                    onChange = { this._onDisplayNameChange }
                    shouldFitContainer = { true }
                    type = 'text'
                    value = { this.state.displayName } />

                <div className = 'info-dialog-password'>
                    <PasswordForm
                        editEnabled = { this.state.passwordEditEnabled }
                        locked = { this.props._locked }
                        onSubmit = { this._onPasswordSubmit }
                        password = { this.props._password }
                        passwordNumberOfDigits = { this.props._passwordNumberOfDigits } />
                </div>
                <div className = 'info-dialog-action-links'>
                    <div className = 'info-dialog-action-link'>
                        {/* <a
                            className = 'info-copy'
                            onClick = { this._onCopyInviteInfo }>
                            { t('dialog.copy') }
                        </a> */}
                    </div>
                    {/* { this._renderPasswordAction() } */}
                </div>
            </Dialog>);
    }

    _onDisplayNameChange: (Object) => void;

    _onPasswordChange: (Object) => void;

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

    _onPasswordChange(event) {
        this.setState({
            passwordConf: event.target.value
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
        const { _conference } = this.props;

        this.props.dispatch(setPassword(
            _conference,
            _conference.lock,
            this.state.passwordConf
        ));

        return this._onSetDisplayName(this.state.displayName);
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

    /**
     * Returns a ReactElement for interacting with the password field.
     *
     * @private
     * @returns {null|ReactElement}
     */
    _renderPasswordAction() {
        const { t } = this.props;
        let className, onClick, textKey;


        if (!this.props._canEditPassword) {
            // intentionally left blank to prevent rendering anything
        } else if (this.state.passwordEditEnabled) {
            className = 'cancel-password';
            onClick = this._onTogglePasswordEditState;
            textKey = 'info.cancelPassword';
        } else if (this.props._locked) {
            className = 'remove-password';
            onClick = this._onPasswordRemove;
            textKey = 'dialog.removePassword';
        } else {
            className = 'add-password';
            onClick = this._onTogglePasswordEditState;
            textKey = 'info.addPassword';
        }

        return className && onClick && textKey
            ? <div className = 'info-dialog-action-link'>
                <a
                    className = { className }
                    onClick = { onClick }>
                    { t(textKey) }
                </a>
            </div>
            : null;
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
        //    _inviteURL: getInviteURL(state),
           _localParticipantName: localParticipant?.name,
        //    _locationURL: state['features/base/connection'].locationURL,
           _locked: locked,
           _password: password
       };
   }
export default translate(connect(_mapStateToProps)(DisplayNamePrompt));
