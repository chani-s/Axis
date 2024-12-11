import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (data: { message: string }) => {
    setMessages((prev) => [...prev, data.message]);
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <button onClick={() => addMessage({ message: 'הודעה חדשה' })}>
        הוסף הודעה
      </button>
    </div>
  );
};

export default Chat;
