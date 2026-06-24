import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const SLOT_DURATION = 60; // minutes
const WORK_START = 9;
const WORK_END = 18;

function getAuth() {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
    return new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });
}

function generateSlots(date: Date): Date[] {
    const slots: Date[] = [];
    for (let hour = WORK_START; hour < WORK_END; hour++) {
        const slot = new Date(date);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
    }
    return slots;
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: 'Data obrigatória' });
    }

    try {
        const auth = getAuth();
        const calendar = google.calendar({ version: 'v3', auth });

        const dayStart = new Date(date as string);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date as string);
        dayEnd.setHours(23, 59, 59, 999);

        const busyResponse = await calendar.freebusy.query({
            requestBody: {
                timeMin: dayStart.toISOString(),
                timeMax: dayEnd.toISOString(),
                items: [{ id: CALENDAR_ID }],
            },
        });

        const busyPeriods = busyResponse.data.calendars?.[CALENDAR_ID]?.busy ?? [];

        const allSlots = generateSlots(dayStart);

        const availableSlots = allSlots.filter((slot) => {
            const slotEnd = new Date(slot.getTime() + SLOT_DURATION * 60 * 1000);
            const isPast = slot < new Date();
            const isWeekend = slot.getDay() === 0 || slot.getDay() === 6;

            if (isPast || isWeekend) return false;

            return !busyPeriods.some((busy) => {
                const busyStart = new Date(busy.start!);
                const busyEnd = new Date(busy.end!);
                return slot < busyEnd && slotEnd > busyStart;
            });
        });

        return res.status(200).json({
            slots: availableSlots.map((s) => s.toISOString()),
        });
    } catch (error) {
        console.error('AVAILABLE SLOTS ERROR:', error);
        return res.status(500).json({ error: 'Erro ao obter slots disponíveis' });
    }
}
