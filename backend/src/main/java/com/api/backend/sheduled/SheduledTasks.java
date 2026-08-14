package com.api.backend.sheduled;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.api.backend.model.Disponibilidad;
import com.api.backend.model.Poseer;
import com.api.backend.model.Reserva;
import com.api.backend.repository.DisponibilidadRepository;
import com.api.backend.repository.PoseerRepository;
import com.api.backend.repository.ReservaRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SheduledTasks {

    private final ReservaRepository reservaRepository;
    private final DisponibilidadRepository disponibilidadRepository;
    private final PoseerRepository poseerRepository;

    @PostConstruct
    @Scheduled(cron = "0 0 * * * *")
    public void sheduledTask(){
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        eliminarDisponibilidades(currentDate, currentTime);
        actualizarEstadosReservas(currentDate, currentTime);
    }

    public void eliminarDisponibilidades(LocalDate currentDate, LocalTime currentTime){

        List<Disponibilidad> disponibilidades = disponibilidadRepository.findAll();
        
        for(Disponibilidad disponibilidad : disponibilidades){
            if(disponibilidad.getFDiadisponibilidad().isBefore(currentDate)){
                List<Poseer> poseer = poseerRepository.findBykIddisponibilidad(disponibilidad.getKIddisponibilidad());
                for(Poseer p : poseer){
                    poseerRepository.delete(p);
                }
                disponibilidadRepository.delete(disponibilidad);
            }

            if((disponibilidad.getFDiadisponibilidad().equals(currentDate)) 
                    && (!disponibilidad.getFHorainiciodisponibilidad().isAfter(currentTime))){
                List<Poseer> poseer = poseerRepository.findBykIddisponibilidad(disponibilidad.getKIddisponibilidad());
                for(Poseer p : poseer){
                    poseerRepository.delete(p);
                }
                disponibilidadRepository.delete(disponibilidad);
            }
        }
    }


    public void actualizarEstadosReservas(LocalDate currentDate, LocalTime currentTime){
        List<Reserva> reservas = reservaRepository.findAll();
        for(Reserva reserva : reservas){
            //Actualizar estado de reservado a en progreso
            if(reserva.getFFechareserva().equals(currentDate) 
                && reserva.getFHorainicioreserva().equals(currentTime) 
                    && reserva.getNEstadoreserva().equals("reservado")){
                reserva.setNEstadoreserva("en progreso");
                reservaRepository.save(reserva);
            }

            if(reserva.getFFechareserva().isBefore(currentDate) && (reserva.getNEstadoreserva().equals("en progreso") || reserva.getNEstadoreserva().equals("reservado"))){
                reserva.setNEstadoreserva("finalizado");
                reservaRepository.save(reserva);
            }

            if((reserva.getFFechareserva().equals(currentDate))
                && (!reserva.getFHorafinalreserva().isAfter(currentTime))
                    && (reserva.getNEstadoreserva().equals("en progreso") || reserva.getNEstadoreserva().equals("reservado"))){
                        reserva.setNEstadoreserva("finalizado");
                        reservaRepository.save(reserva);
                    }

        }
    }
}
