// src/screens/BookingProcess.jsx (CAMINHOS 100% CORRIGIDOS)
import React, { useState } from 'react';
// CAMINHOS CORRIGIDOS: De 'src/screens' para 'src/api' é "../api"
import api from '../api';
import { BackIcon } from '../components/Icons.jsx';
import { toast } from 'react-toastify';

import ServiceSelectionStep from '../components/Booking/ServiceSelectionStep.jsx';
import ProfessionalSelectionStep from '../components/Booking/ProfessionalSelectionStep.jsx';
import TimeSelectionStep from '../components/Booking/TimeSelectionStep.jsx';
import ConfirmationStep from '../components/Booking/ConfirmationStep.jsx';
import SuccessStep from '../components/Booking/SuccessStep.jsx';

export default function BookingProcess({ user, onBookingSuccess }) { 
 	const [step, setStep] = useState(1);
 	const [bookingDetails, setBookingDetails] = useState({ services: [], professional: null, dateTime: null, observations: '' });

 	const nextStep = () => setStep(prev => prev + 1);
 	const prevStep = () => setStep(prev => prev - 1);
 	
 	const handleSuccessFinish = () => {
 		setBookingDetails({ services: [], professional: null, dateTime: null, observations: '' });
 		setStep(1);
 		onBookingSuccess(); 
 	}

 	const handleSelectServices = (selectedServices) => {
 		setBookingDetails(prev => ({ ...prev, services: selectedServices }));
 		nextStep();
 	};

 	const handleSelectProfessional = (professional) => {
 		setBookingDetails(prev => ({ ...prev, professional: professional }));
 		nextStep();
 	};

 	const handleSelectDateTime = (dateTime) => {
 		setBookingDetails(prev => ({ ...prev, dateTime: dateTime }));
 		nextStep();
 	};

 	const handleConfirmBooking = async (observations) => {
 		try {
 			const payload = {
 				id_servico: bookingDetails.services[0].id,
 				id_profissional: bookingDetails.professional.id,
 				data_hora_inicio: bookingDetails.dateTime,
 				observacao: observations
 			};
 			await api.post('/appointments', payload);
 			setStep(5);
 		} catch (error) {
 			console.error("Erro ao confirmar agendamento", error);
 			const errorMessage = error.response?.data?.message || "Não foi possível realizar o agendamento.";
 			toast.error(errorMessage);
 			setStep(3); 
 		}
 	};

 	const steps = [
 		{ num: 1, title: "Escolha os Serviços" },
 		{ num: 2, title: "Escolha o Profissional" },
 		{ num: 3, title: "Escolha o Horário" },
 		{ num: 4, title: "Confirmação" },
 	];

 	const selectedServiceId = bookingDetails.services[0]?.id;

 	return (
 		<div>
 			<header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
 				<div className="flex items-center space-x-4">
 					{step > 1 && step < 5 && (
 						<button onClick={prevStep} className="p-2 rounded-full hover:bg-gray-200"><BackIcon /></button>
 					)}
 					<h1 className="text-xl md:text-2xl font-bold text-gray-700">{steps.find(s => s.num === step)?.title || "Agendamento"}</h1>
 				</div>
 			</header>

 			<main className="max-w-4xl mx-auto">
 				{step === 1 && <ServiceSelectionStep onContinue={handleSelectServices} />}
 				{step === 2 && <ProfessionalSelectionStep onContinue={handleSelectProfessional} selectedServiceId={selectedServiceId} />}
 				{step === 3 && <TimeSelectionStep bookingDetails={bookingDetails} onContinue={handleSelectDateTime} />}
 				{step === 4 && <ConfirmationStep bookingDetails={bookingDetails} onConfirm={handleConfirmBooking} />}
 				{step === 5 && <SuccessStep onFinish={handleSuccessFinish} />}
 			</main>
 		</div>
 	);
}