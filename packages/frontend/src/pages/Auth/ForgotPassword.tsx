import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import { useTranslation } from 'react-i18next';
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
  const [/*isConfirming*/, setIsConfirming] = useState(false);
  const [/*isSendingCode*/, setIsSendingCode] = useState(false);
  const { t } = useTranslation(); // Hook to access translation functions
    
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

    // if (fields.password !== fields.confirmPassword) {
    //   console.log('New password and confirm password do not match');
    //   toast.error('New password and confirm password do not match');
    //   return;
    // }
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

     // if (fields.password !== fields.confirmPassword) {
    //   console.log('New password and confirm password do not match');
    //   toast.error('New password and confirm password do not match');
    //   return;
    // }

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
      toast.error(`Password should be +6 characters, 1 Capital letter, 1 Symbol, and 1 Number`);
      setIsConfirming(false);
    }
  }

  function renderRequestCodeForm() {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
         <h1 className="text-2xl font-semibold mb-4"> {t('enterEmail')}</h1>

      <form onSubmit={handleSendCodeClick} className="max-w-md mx-auto">
        <input
          autoFocus
          type="email"
          id="email"
          value={fields.email}
          required
          placeholder="univerisityEmail@gmail.com"

          onChange={handleFieldChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

        />
       <div className="mb-4 mt-4">

        <button
          type="submit"
          disabled={!validateCodeForm()}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
      {t('confirmation')}
        </button>
        </div>

      </form>
      </div>
      </div>
    );
  }

  function renderConfirmationForm() {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

      <form onSubmit={handleConfirmClick} className="max-w-md mx-auto">
      <div className="mb-4">

        <label htmlFor="code" className="block text-sm font-medium text-gray-700"> {t('confirmationCode')}</label>
        <input
          autoFocus
          type="tel"
          id="code"
          value={fields.code}
          onChange={handleFieldChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

        />
        </div>
        <div className="mb-4">

        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700"> {t('newPassword')}</label>
        <input
          type="password"
          id="password"
          value={fields.password}
          onChange={handleFieldChange}
          placeholder="6+ Characters, 1 Capital letter, 1 Number, 1 Symbol"
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

        />
        </div>
        <div className="mb-4">
        
        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">{t('confirmPassword')}</label>
        <input
          type="password"
          id="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleFieldChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

        />
        </div>
        <div className="mb-4">

        <button
          type="submit"
          disabled={!validateResetForm()}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
          {t('confirm')}
        </button>
        </div>
      </form>
      </div>
      </div>
    );
  }

  function renderSuccessMessage() {
    return (
<div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                  <p className="block text-lg font-medium text-gray-700">{t('passwordResetSuccess')} <Link to="/Auth/SignInPage" className="font-bold text-black-700 underline">here</Link> {t('passwordResetSuccessContinue')}</p>
     </div>
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
