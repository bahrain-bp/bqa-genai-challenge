import React, { useState, useEffect } from 'react';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

const SignInPage = ({ setUser, user }: { setUser: SetStateType<any>, user: any }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    toast.info('Logging in...', { position: 'top-center' });
    try {
      const user = await signIn({ username: email, password });
      setUser(user);
      toast.success('Welcome!', { position: 'top-center' });
      navigate('/Dashboard'); // Redirect to dashboard after successful sign-in
    } catch (error) {
      console.error('Error signing in', email, error);
      toast.error('Error signing in', { position: 'top-center' });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null); // Update state to reflect sign-out
      toast.success('Logged out successfully', { position: 'top-center' });
    } catch (error) {
      console.error('Error signing out', error);
      toast.error('Error during logout', { position: 'top-center' });
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        navigate('/Dashboard');
      }
    };
    checkUser();
  }, []);

  return (
    <div className="flex justify-center items-center lg:mt-[40px] xl:mt-[70px] w-screen pt-8">
      <div className="flex justify-center items-center flex-col border border-stone-700 bg-stone-50 rounded-md h-[500px] w-[350px] shadow-lg ">
        <ToastContainer />
        <form>
          <legend className="flex justify-center items-center font-extrabold text-xlg mb-4 text-stone-700">Sign in</legend>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            id="username"
            required
            className="w-full h-10 px-4 text-sm peer bg-white outline-none"
            placeholder="Enter Your Email"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            required
            className="w-full h-10 px-4 text-sm peer bg-white outline-none"
            placeholder="Enter Your Password"
          />
          <button
            className="mt-4 w-full px-4 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
            type="button"
            onClick={() => handleSignIn(email, password)}
          >
            Login
          </button>
          
          {user && (
            <button
              className="mt-4 w-full px-4 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
              type="button"
              onClick={handleSignOut}
            >
              Log out
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
