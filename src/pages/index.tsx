import { FormEventHandler, useState } from 'react';

const serverAPI = process.env.SERVER_API;

const fetchFn = async (prompt: string, history: any) => {
  return prompt.split('').reverse().join('');
  const answer = fetch(`${serverAPI}/v1/engines/davinci-codex/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    body: JSON.stringify({ prompt, history }),
  }).then((res) => res.json());
  return answer as unknown as string;
};

type Message = {
  role: 'assistant' | 'user';
  text: string;
};
type History = Message[];

export default function Home() {
  const [history, setHistory] = useState<History>([]);
  const [userInput, setUserInput] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setHistory([...history, { role: 'user', text: userInput }]);
    const data = await fetchFn(userInput, history);
    setHistory([
      ...history,
      { role: 'user', text: userInput },
      { role: 'assistant', text: data },
    ]);
    setUserInput('');
  };

  return (
    <div className='chat-window'>
      <div>
        {history.map((message, index) => (
          <p
            key={index}
            className={
              message.role === 'assistant'
                ? 'message-outgoing'
                : 'message-incoming'
            }
          >
            <strong>{message.role}:</strong> {message.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={userInput}
          className='text-input'
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}
