import React, { useState } from 'react';

const Email: React.FC = () => {
    const [userEmail, setUserEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        try {
            const response = await fetch('https://96s5s8nyi1.execute-api.us-east-1.amazonaws.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail, subject, body }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            
            if (responseData.result === 'OK') {
                setResponseMessage('Email sent successfully!');
            } else {
                setResponseMessage('Error sending email.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setResponseMessage('An error occurred while sending the email.');
        }
    };

    return (
        <div>
            <h1>Send Email</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userEmail">Recipient Email:</label><br />
                <input type="email" id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required /><br /><br />
                <label htmlFor="subject">Subject:</label><br />
                <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} /><br /><br />
                <label htmlFor="body">Body:</label><br />
                <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)}  required></textarea><br /><br />
                <button type="submit">Send Email</button>
            </form>
            <div>{responseMessage}</div>
        </div>
    );
}

export default Email;
