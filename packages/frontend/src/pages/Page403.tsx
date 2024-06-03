// test test
import { useEffect } from 'react';
import './styles.scss'; // Make sure to include your CSS file
import { useNavigate } from 'react-router-dom';

const Page403 = () => {
  const navigate = useNavigate(); // Declare navigate here to use it anywhere in your component

  const goToLogin = () => {
    navigate('/Auth/SignInPage');
  };

  useEffect(() => {
    const interval = 500;

    function generatePosition() {
      const x = `${Math.round((Math.random() * 100) - 10)}%`;
      const y = `${Math.round(Math.random() * 100)}%`;
      return [x, y];
    }

    function generateLocks() {
      const lock = document.createElement('div'),
            position = generatePosition();
      lock.innerHTML = '<div class="top"></div><div class="bottom"></div>';
      lock.style.position = 'absolute';
      lock.style.left = position[0];
      lock.style.top = position[1];
      lock.className = 'custom-lock'; // Updated class name
      document.body.appendChild(lock);

      setTimeout(() => {
        lock.style.opacity = '1';
        lock.classList.add('generated'); // Ensure this matches any related styles
      }, 100);

      setTimeout(() => {
        if (lock.parentElement) {
          lock.parentElement.removeChild(lock);
        }
      }, 2000);
    }

    const lockInterval = setInterval(generateLocks, interval);
    generateLocks();

    return () => {
      clearInterval(lockInterval);
    };
  }, []);

  return (
    <div className="custom-container" > 
      <h1>
        4
        <div className="custom-lock"> 
          <div className="top"></div>
          <div className="bottom"></div>
        </div>
        3
      </h1>
      <p>Access denied</p>
      <button onClick={goToLogin} className="login-button">Click here to go back to login page</button>
    </div>
  );
};

export default Page403;
