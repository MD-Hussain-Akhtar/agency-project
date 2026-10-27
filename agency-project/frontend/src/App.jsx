import LeadForm from './components/LeadForm';
import Chatbot from './components/Chatbot';

export default function App() {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                <LeadForm />
                <Chatbot />
            </div>
        </div>
    );
}