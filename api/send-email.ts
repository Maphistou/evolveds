import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { name, phone, business, pack, message } = req.body;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'comercial@evolveds.pt',
            subject: `Novo pedido de proposta - ${business || name}`,
            html: `
        <h2>Novo pedido de proposta</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Empresa:</strong> ${business}</p>
        <p><strong>Pacote:</strong> ${pack}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
        });

        return res.status(200).json({ success: true });
    } catch {
        return res.status(500).json({ error: 'Erro ao enviar email' });
    }
}