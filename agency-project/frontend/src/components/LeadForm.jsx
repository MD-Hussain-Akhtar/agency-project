import { useState, useEffect } from 'react';

export default function LeadForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        service: 'Business Website (₹18,000)'
    });
    const [leads, setLeads] = useState([]);

    const fetchLeads = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/leads');
            const data = await res.json();
            setLeads(data);
        } catch (err) {
            console.error('Error fetching leads:', err);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setFormData({ name: '', phone: '', service: 'Business Website (₹18,000)' });
        fetchLeads();
    };

    return (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-400 mb-1">Book Your Website</h2>
            <p className="text-slate-400 text-sm mb-5">MySQL Trigger + Stored Procedure Powered</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Client Name (Trigger will UPPERCASE it)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    required
                />
                <input
                    type="text"
                    placeholder="WhatsApp Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    required
                />
                <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                    <option>Basic Portfolio Website (₹8,000)</option>
                    <option>Business Website (₹18,000)</option>
                    <option>E-Commerce Full-Stack App (₹30,000)</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold">
                    Save Client Lead
                </button>
            </form>

            <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Saved Leads (From `CALL get_all_leads()`)</h3>
                <div className="max-h-44 overflow-y-auto space-y-2">
                    {leads.map((lead) => (
                        <div key={lead.id} className="bg-slate-900 p-3 rounded-lg text-sm flex justify-between border border-slate-700">
                            <span><strong>{lead.name}</strong> ({lead.phone})</span>
                            <span className="text-blue-400">{lead.service}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}