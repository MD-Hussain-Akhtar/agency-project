import { useState } from 'react';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Namaste! Hum aapke business ke liye kaunsi website bana sakte hain?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userText = input;
        const updated = [...messages, { sender: 'user', text: userText }];
        setMessages(updated);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: userText })
            });
            const data = await res.json();
            setMessages([...updated, { sender: 'bot', text: data.reply }]);
        } catch (err) {
            setMessages([...updated, { sender: 'bot', text: 'Backend server chalu nahi hai!' }]);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-[520px] overflow-hidden">
            <div className="bg-blue-600 p-4 font-bold flex justify-between items-center">
                <span>Gemini AI Assistant</span>
                <span className="text-xs bg-green-400 text-slate-900 px-2 py-0.5 rounded-full font-semibold">Live</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-xl text-sm max-w-[80%] ${
                        msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-700 text-slate-100'
                    }`}>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="text-xs text-slate-400">Gemini typing...</div>}
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about website price or features..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold">
                    Send
                </button>
            </div>
        </div>
    );
}