import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { resetPassword, confirmResetPassword,
   type ResetPasswordOutput, type ConfirmResetPasswordInput } from 'aws-amplify/auth';

type Fields = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export default function ForgotPassword() {
  const [fields, setFields] = useState<Fields>({
    code: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.id]: e.target.value
    });
  };

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSendCodeClick(event:any) {
    event.preventDefault();
    setIsSendingCode(true);

    try {
      const output = await resetPassword({ username: fields.email });
      setCodeSent(true);
      handleResetPasswordNextSteps(output);
    } 
    catch (error) {
      console.error(error);
      setIsSendingCode(false);
    }
  }

  function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;

        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}`
        );
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
  }

  async function handleConfirmClick(event:any) {
    event.preventDefault();
    setIsConfirming(true);

    const input: ConfirmResetPasswordInput = {
      username: fields.email,
      confirmationCode: fields.code,
      newPassword: fields.password
    };

    try {
      await confirmResetPassword(input);
      setConfirmed(true);
    } catch (error) {
      console.error(error);
      setIsConfirming(false);
    }
  }

  function renderRequestCodeForm() {
    return (
      <form onSubmit={handleSendCodeClick}>
        <label>Email</label>
        <input
          autoFocus
          type="email"
          id="email"
          value={fields.email}
          onChange={handleFieldChange}
        />
        <button
          type="submit"
          disabled={!validateCodeForm()}
        >
          Send Confirmation
        </button>
      </form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <label>Confirmation Code</label>
        <input
          autoFocus
          type="tel"
          id="code"
          value={fields.code}
          onChange={handleFieldChange}
        />
        <label>New Password</label>
        <input
          type="password"
          id="password"
          value={fields.password}
          onChange={handleFieldChange}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleFieldChange}
        />
        <button
          type="submit"
          disabled={!validateResetForm()}
        >
          Confirm
        </button>
      </form>
    );
  }

  function renderSuccessMessage() {
    return (
      <div className="success">
        <p>Your password has been reset. Click <Link to="/login">here</Link> to login with your new credentials.</p>
      </div>
    );
  }

  return (
    <div className="ResetPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
}
