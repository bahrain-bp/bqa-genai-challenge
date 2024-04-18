import React, { useState } from 'react';
import { resetPassword, ResetPasswordOutput } from 'aws-amplify/auth';
import {
    confirmResetPassword,
    type ConfirmResetPasswordInput
  } from 'aws-amplify/auth';
 
  import { BsCheck } from 'react-icons/bs';
  import { Link } from 'react-router-dom';

const ForgotPassword = () => {
   
    const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

      
/*
      async function handleSendCodeClick(event:any) {
        event.preventDefault();
    
        setIsSendingCode(true);
    
        try {
          await resetPassword(username);
          setCodeSent(true);
        } catch (error) {
            console.log(error);
          setIsSendingCode(false);
        }
      }



      async function handleConfirmClick(event:any) {
        event.preventDefault();
        setIsConfirming(true);
    
        try {
          await confirmResetPassword(
            fields.email,
            fields.code,
            fields.password
          );
          setConfirmed(true);
        } catch (error) {
            console.log(error);
          setIsConfirming(false);
        }
      }

   

      function renderRequestCodeForm() {
        return (
          <form onSubmit={handleSendCodeClick}>
            <FormGroup bsSize="large" controlId="email">
              <FormLabel>Email</FormLabel>
              <FormControl
                autoFocus
                type="email"
                value={fields.email}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <LoaderButton
              block
              type="submit"
              bsSize="large"
              isLoading={isSendingCode}
              disabled={!validateCodeForm()}
            >
              Send Confirmation
            </LoaderButton>
          </form>
        );
      }
      function renderConfirmationForm() {
        return (
          <form onSubmit={handleConfirmClick}>
            <FormGroup bsSize="large" controlId="code">
              <FormLabel>Confirmation Code</FormLabel>
              <FormControl
                autoFocus
                type="tel"
                value={fields.code}
                onChange={handleFieldChange}
              />
              <FormText>
                Please check your email ({fields.email}) for the confirmation code.
              </FormText>
            </FormGroup>
            <hr />
            <FormGroup bsSize="large" controlId="password">
              <FormLabel>New Password</FormLabel>
              <FormControl
                type="password"
                value={fields.password}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup bsSize="large" controlId="confirmPassword">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl
                type="password"
                value={fields.confirmPassword}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <LoaderButton
              block
              type="submit"
              bsSize="large"
              isLoading={isConfirming}
              disabled={!validateResetForm()}
            >
              Confirm
            </LoaderButton>
          </form>
        );
      }

      function renderSuccessMessage() {
        return (
          <div className="success">
            <p><BsCheck size={16} /> Your password has been reset.</p>
            <p>
              <Link to="/login">
                Click here to login with your new credentials.
              </Link>
            </p>
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






*/

};

export default ForgotPassword;

function useFormFields(arg0: { code: string; email: string; password: string; confirmPassword: string; }): [any, any] {
    throw new Error('Function not implemented.');
}

