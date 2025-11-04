import React, { useState } from 'react';
import DayTimeline from './DayTimeline.jsx'; // Corrigi o caminho para .jsx


export default function AgendaTimelineView({ appointments, onSelectAppointment }) { // Adicionamos onSelectAppointment
    const [currentDate, setCurrentDate] = useState(new Date());


    // --- INÍCIO DA CORREÇÃO ---
    // Reescrevemos as funções para serem "imutáveis" (não alterar o estado 'prev')
   
    const goToPreviousWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate); // 1. Cria uma cópia da data atual
            newDate.setDate(newDate.getDate() - 7); // 2. Modifica a cópia
            return newDate; // 3. Retorna a nova data
        });
    };


    const goToNextWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate); // 1. Cria uma cópia
            newDate.setDate(newDate.getDate() + 7); // 2. Modifica a cópia
            return newDate; // 3. Retorna a nova data
        });
    };
    // --- FIM DA CORREÇÃO ---


    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Ajuste para a semana começar na Segunda
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };


    const weekDays = getWeekDays(currentDate);


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousWeek} className="px-4 py-2 bg-gray-200 rounded-lg">Anterior</button>
                <h3 className="text-xl font-bold text-center">
                    Semana de {weekDays[0].toLocaleDateString('pt-BR')} à {weekDays[6].toLocaleDateString('pt-BR')}
                </h3>
                <button onClick={goToNextWeek} className="px-4 py-2 bg-gray-200 rounded-lg">Próxima</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {weekDays.map(day => {
                    const dailyAppointments = appointments.filter(a => a && a.data_hora_inicio && new Date(a.data_hora_inicio).toDateString() === day.toDateString());
                    return <DayTimeline
                        key={day.toISOString()}
                        date={day}
                        appointments={dailyAppointments}
                        onSelectAppointment={onSelectAppointment} // Passa a função para o DayTimeline
                    />;
                })}
            </div>
        </div>
    );
};
