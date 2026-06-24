import { google } from 'googleapis';
import { Resend } from 'resend';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const SLOT_DURATION = 60; // minutes
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getAuth() {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
    return new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { name, email, phone, datetime, notes } = req.body;

    if (!name || !email || !datetime) {
        return res.status(400).json({ error: 'Nome, email e data/hora obrigatórios' });
    }

    try {
        const auth = getAuth();
        const calendar = google.calendar({ version: 'v3', auth });

        const start = new Date(datetime);
        const end = new Date(start.getTime() + SLOT_DURATION * 60 * 1000);

        const event = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            sendUpdates: 'all',
            requestBody: {
                summary: `Reunião Evolve — ${name}`,
                description: `Telefone: ${phone || 'N/A'}\n\nNotas: ${notes || 'N/A'}`,
                start: { dateTime: start.toISOString(), timeZone: 'Europe/Lisbon' },
                end: { dateTime: end.toISOString(), timeZone: 'Europe/Lisbon' },
                attendees: [{ email }],
                conferenceData: {
                    createRequest: {
                        requestId: `evolve-${Date.now()}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
            },
            conferenceDataVersion: 1,
        });

        const meetLink = event.data.conferenceData?.entryPoints?.[0]?.uri ?? '';
        const dateLabel = start.toLocaleDateString('pt-PT', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        const timeLabel = start.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

        await resend?.emails.send({
            from: 'Evolve <comercial@evolveds.pt>',
            to: email,
            subject: 'Reunião confirmada — Evolve',
            html: `
                <h2>Reunião confirmada!</h2>
                <p>Olá ${name},</p>
                <p>A sua reunião com a Evolve foi agendada com sucesso.</p>
                <p><strong>Data:</strong> ${dateLabel}</p>
                <p><strong>Hora:</strong> ${timeLabel}</p>
                ${meetLink ? `<p><strong>Link Google Meet:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ''}
                <p>Até breve,<br/>Equipa Evolve</p>
            `,
        });

        await resend?.emails.send({
            from: 'Evolve <comercial@evolveds.pt>',
            to: 'comercial@evolveds.pt',
            subject: `Nova reunião agendada — ${name}`,
            html: `
                <h2>Nova reunião agendada</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Data/Hora:</strong> ${dateLabel} às ${timeLabel}</p>
                <p><strong>Notas:</strong> ${notes || 'N/A'}</p>
                ${meetLink ? `<p><strong>Meet:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ''}
            `,
        });

        return res.status(200).json({ success: true, eventId: event.data.id, meetLink });
    } catch (error: any) {
        console.error('BOOK MEETING ERROR:', JSON.stringify(error?.message ?? error, null, 2));
        return res.status(500).json({ error: error?.message ?? 'Erro ao agendar reunião' });
    }
}
