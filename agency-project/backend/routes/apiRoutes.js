const express = require('express');
const router = express.Router();
const db = require('../config/db');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// AI client ko sabse upar initialize karein (Best Practice)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY?.trim() });

// 1. POST: Gemini AI Chat + Save to MySQL
router.post('/chat', async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage) {
            return res.status(400).json({ reply: 'Message khali nahi ho sakta!' });
        }

        // MySQL se saved leads nikaalein (safe try-catch ke sath)
        let leadsData = [];
        try {
            const [rows] = await db.execute('SELECT name, phone, service FROM leads');
            leadsData = rows;
        } catch (dbErr) {
            console.log('Database read warning:', dbErr.message);
        }

        // Gemini API Call with gemini-3.8-flash
        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userMessage,
            config: {
                systemInstruction: `Tum ek Web Development Agency ke AI Assistant ho. Clients ko polite Hinglish mein chhota aur clear jawab do. 
                Hamare Plans: Basic Website ₹8,000, Business Website ₹18,000, E-commerce ₹30,000.
                Database mein Saved Client Leads yeh hain: ${JSON.stringify(leadsData)}. 
                Agar koi kisi client ka number, naam ya plan puche, to is list se dekh kar turant batao.`
            }
        });

        // SDK response text extraction
        const botReply = response.text || 'Main aapki kya madad kar sakta hoon?';

        // Chat log safely save karein
        try {
            await db.execute(
                'INSERT INTO chat_logs (user_message, bot_reply) VALUES (?, ?)',
                [userMessage, botReply]
            );
        } catch (logErr) {
            console.log('Chat log save warning:', logErr.message);
        }

        res.json({ reply: botReply });
    } catch (error) {
        console.error('ASLI CHAT ERROR:', error);
        res.status(500).json({ reply: 'AI Error: ' + error.message });
    }
});

// 2. POST: Save Lead
router.post('/leads', async (req, res) => {
    try {
        const { name, phone, service } = req.body;
        await db.execute(
            'INSERT INTO leads (name, phone, service) VALUES (?, ?, ?)',
            [name, phone, service]
        );
        res.json({ success: true, message: 'Lead saved!' });
    } catch (error) {
        console.error('Lead Insert Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. GET: Fetch Leads using Stored Procedure
router.get('/leads', async (req, res) => {
    try {
        const [rows] = await db.execute('CALL get_all_leads()');
        res.json(rows[0]);
    } catch (error) {
        console.error('Fetch Leads Error:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

module.exports = router;