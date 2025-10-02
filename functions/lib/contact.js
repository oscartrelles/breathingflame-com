"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = void 0;
const functions = require("firebase-functions");
const corsLib = require("cors");
const cors = corsLib({ origin: true });
exports.contact = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).end();
            return;
        }
        // Parse JSON body
        const { name, email, type, message, phone } = req.body || {};
        if (!name || !email || !message) {
            res.status(400).json({ ok: false, error: 'Missing fields' });
            return;
        }
        try {
            const apiKey = functions.config().mailersend.api_key;
            const sender = functions.config().mailersend.sender;
            const receiver = functions.config().mailersend.receiver;
            const payload = {
                from: { email: sender, name: 'Breathing Flame Contact Form' },
                to: [{ email: receiver, name: 'Breathing Flame' }],
                subject: `New Contact Form Submission – ${type || 'General'}`,
                text: `Name: ${name}\nEmail: ${email}\nType: ${type}\n${phone ? `Phone: ${phone}\n` : ''}Message:\n${message}`,
                reply_to: { email, name }
            };
            const r = await fetch('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!r.ok)
                throw new Error(`MailerSend error ${r.status}`);
            res.status(200).json({ ok: true });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ ok: false, error: 'MailerSend failed' });
        }
    });
});
//# sourceMappingURL=contact.js.map