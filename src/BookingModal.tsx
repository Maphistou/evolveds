import { FormEvent, useEffect, useState } from 'react';

type Step = 'calendar' | 'slots' | 'form' | 'success';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

export default function BookingModal({ onClose }: { onClose: () => void }) {
    const today = new Date();
    const [step, setStep] = useState<Step>('calendar');
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [slots, setSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [meetLink, setMeetLink] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    async function fetchSlots(date: Date) {
        setLoadingSlots(true);
        setSlots([]);
        try {
            const iso = date.toISOString().split('T')[0];
            const res = await fetch(`/api/available-slots?date=${iso}`);
            const data = await res.json();
            setSlots(data.slots ?? []);
        } catch {
            setSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    }

    function selectDate(date: Date) {
        setSelectedDate(date);
        setSelectedSlot(null);
        fetchSlots(date);
        setStep('slots');
    }

    async function handleBook(e: FormEvent) {
        e.preventDefault();
        if (!selectedSlot) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/book-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, datetime: selectedSlot, notes }),
            });
            const data = await res.json();
            if (res.ok) {
                setMeetLink(data.meetLink ?? '');
                setStep('success');
            } else {
                alert(`Erro: ${data.error ?? 'Erro ao agendar reunião.'}`);
            }
        } catch (err: any) {
            alert(`Erro: ${err?.message ?? 'Erro ao agendar reunião.'}`)
        } finally {
            setSubmitting(false);
        }
    }

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    }

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    function formatSlot(iso: string) {
        const d = new Date(iso);
        return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    }

    function formatDate(d: Date) {
        return d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                {step === 'calendar' && (
                    <>
                        <p className="kicker">Agendar reunião</p>
                        <h3 className="modal-title">Escolha um dia</h3>
                        <div className="cal-nav">
                            <button onClick={prevMonth}>‹</button>
                            <span>{MONTHS[viewMonth]} {viewYear}</span>
                            <button onClick={nextMonth}>›</button>
                        </div>
                        <div className="cal-grid">
                            {WEEKDAYS.map(d => <span key={d} className="cal-weekday">{d}</span>)}
                            {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const date = new Date(viewYear, viewMonth, i + 1);
                                const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                                const isWeekend = date.getDay() === 6 || date.getDay() === 0;
                                const isSelected = selectedDate && isSameDay(date, selectedDate);
                                if (isPast || isWeekend) {
                                    return <span key={i} className="cal-day disabled">{i + 1}</span>;
                                }
                                return (
                                    <button
                                        key={i}
                                        className={`cal-day${isSelected ? ' selected' : ''}`}
                                        onClick={() => selectDate(date)}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {step === 'slots' && selectedDate && (
                    <>
                        <button className="modal-back" onClick={() => setStep('calendar')}>‹ Voltar</button>
                        <p className="kicker">Agendar reunião</p>
                        <h3 className="modal-title">{formatDate(selectedDate)}</h3>
                        {loadingSlots ? (
                            <p className="slots-loading">A carregar horários...</p>
                        ) : slots.length === 0 ? (
                            <p className="slots-empty">Sem horários disponíveis neste dia.</p>
                        ) : (
                            <div className="slots-grid">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        className={`slot-btn${selectedSlot === slot ? ' selected' : ''}`}
                                        onClick={() => { setSelectedSlot(slot); setStep('form'); }}
                                    >
                                        {formatSlot(slot)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {step === 'form' && selectedSlot && (
                    <>
                        <button className="modal-back" onClick={() => setStep('slots')}>‹ Voltar</button>
                        <p className="kicker">Agendar reunião</p>
                        <h3 className="modal-title">{formatDate(selectedDate!)} · {formatSlot(selectedSlot)}</h3>
                        <form className="booking-form" onSubmit={handleBook}>
                            <input required placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                            <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
                            <textarea placeholder="Assunto ou notas (opcional)" value={notes} onChange={e => setNotes(e.target.value)} />
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'A agendar...' : 'Confirmar reunião'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'success' && (
                    <div className="booking-success">
                        <div className="success-icon">✓</div>
                        <h3 className="modal-title">Reunião confirmada!</h3>
                        <p>Enviámos uma confirmação para <strong>{email}</strong>.</p>
                        {meetLink && (
                            <a className="meet-link" href={meetLink} target="_blank" rel="noreferrer">
                                Entrar no Google Meet
                            </a>
                        )}
                        <button className="btn btn-dark" onClick={onClose}>Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
}
