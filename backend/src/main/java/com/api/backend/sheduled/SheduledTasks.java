package com.api.backend.shedule;

import java.sql.Date;
import java.sql.Time;
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
import jakarta.persistence.PostLoad;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SheduledTask {

    private final ReservaRepository reservaRepository;
    private final DisponibilidadRepository disponibilidadRepository;
    private final PoseerRepository poseerRepository;

    @PostConstruct
    @Scheduled(cron = "0 0 * * * *")
    public void sheduledTask(){
        LocalDate date = LocalDate.now();
        Date currentDate = Date.valueOf(date);
        LocalTime time = LocalTime.now();
        Time currentTime = Time.valueOf(time);
        eliminarDisponibilidades(currentDate, currentTime);
        actualizarEstadosReservas(currentDate, currentTime);
    }

    public void eliminarDisponibilidades(Date currentDate, Time currentTime){

        List<Disponibilidad> disponibilidades = disponibilidadRepository.findAll();
        
        for(Disponibilidad disponibilidad : disponibilidades){
            if(disponibilidad.getFDiadisponibilidad().before(currentDate)){
                List<Poseer> poseer = poseerRepository.findBykIddisponibilidad(disponibilidad.getKIddisponibilidad());
                for(Poseer p : poseer){
                    poseerRepository.delete(p);
                }
                disponibilidadRepository.delete(disponibilidad);
            }

            if((disponibilidad.getFDiadisponibilidad().equals(currentDate)) 
                    && (disponibilidad.getFHorainiciodisponibilidad().before(currentTime) 
                        || disponibilidad.getFHorainiciodisponibilidad().equals(currentTime))){
                List<Poseer> poseer = poseerRepository.findBykIddisponibilidad(disponibilidad.getKIddisponibilidad());
                for(Poseer p : poseer){
                    poseerRepository.delete(p);
                }
                disponibilidadRepository.delete(disponibilidad);
            }
        }
    }


    public void actualizarEstadosReservas(Date currentDate, Time currentTime){
        List<Reserva> reservas = reservaRepository.findAll();
        for(Reserva reserva : reservas){
            //Actualizar estado de reservado a en progreso
            if(reserva.getFFechareserva().equals(currentDate) 
                && reserva.getFHorainicioreserva().equals(currentTime) 
                    && reserva.getNEstadoreserva().equals("reservado")){
                reserva.setNEstadoreserva("en progreso");
                reservaRepository.save(reserva);
            }

            if(reserva.getFFechareserva().before(currentDate) && (reserva.getNEstadoreserva().equals("en progreso") || reserva.getNEstadoreserva().equals("reservado"))){
                reserva.setNEstadoreserva("finalizado");
                reservaRepository.save(reserva);
            }

            if((reserva.getFFechareserva().equals(currentDate))
                && (reserva.getFHorafinalreserva().equals(currentTime) || reserva.getFHorafinalreserva().before(currentTime))
                    && (reserva.getNEstadoreserva().equals("en progreso") || reserva.getNEstadoreserva().equals("reservado"))){
                        reserva.setNEstadoreserva("finalizado");
                        reservaRepository.save(reserva);
                    }

        }
    }
}
