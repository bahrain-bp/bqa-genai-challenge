import React, { useState, ChangeEvent } from 'react'; // imported ChangeEvent from react

const Email: React.FC = () => {
  // if you recieve an error run: npm install @types/react

  const [formData, setFormData] = useState({
    userEmail: '',
    subject: '',
    body: ''
  });
  const [result, setResult] = useState('');


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await sendEmail(formData);
      if (response && response.result === 'OK') {
        setResult('Email sent successfully');
      } else {
        setResult('Error sending email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setResult('Error sending email');
    }
  };

  const sendEmail = async (emailData: { userEmail: string; subject: string; body: string; }) => {
    const apiUrl = `https://bu6d6fsf7f.execute-api.us-east-1.amazonaws.com/send-email`; // email apiUrl of 'send-email' Lambda function

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Network Error:', error);
      throw new Error('Error sending email');
    }
  };

  return (
    <div>
      <h1>Email Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userEmail">Recipient Email:</label>
        <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleChange} required /><br />
        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required /><br />
        <label htmlFor="body">Body:</label>
        <textarea id="body" name="body" value={formData.body} onChange={handleChange} required /><br />
        <button type="submit">Send Email</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
};

export default Email;
