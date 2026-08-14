package com.api.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.api.backend.model.Reserva;
import com.api.backend.model.ReservarRequest;
import com.api.backend.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservaService {
    
    private final ReservaRepository reservaRepository;
    private final RecursoService recursoService;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");


    public boolean reservarRecurso(ReservarRequest request){
        Reserva reserva = new Reserva();
        reserva.setKIdreserva(this.generarId());
        reserva.setFFechareserva(request.getDia());
        reserva.setFHorafinalreserva(request.getHoraFinal());
        reserva.setFHorainicioreserva(request.getHoraInicio());
        reserva.setNEstadoreserva("reservado");
        reserva.setKIdusuario(request.getIdUsuario());
        reserva.setKIdrecurso(request.getIdRecurso());
        reserva.setNCalificacion(0);
        try {
            reservaRepository.save(reserva);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private String generarId(){
        LocalDateTime now = LocalDateTime.now();
        return now.format(formatter);
    }

    public List<Reserva> getReservas(Long idUser){
        return reservaRepository.findBykIdusuario(idUser);
    }

    public String cancelarReserva(String idReserva, Long userId){
        Optional<Reserva> reserva = reservaRepository.findById(idReserva);
        if(reserva.isEmpty()){
            return "reserva no existe";
        }
        if(!reserva.get().getKIdusuario().equals(userId)){
            return "no autorizado";
        }
        if(reserva.get().getNEstadoreserva().equals("reservado")){

                LocalDateTime now = LocalDateTime.now();
                LocalDate fecha = new java.util.Date(reserva.get().getFFechareserva().getTime()).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalTime hora = reserva.get().getFHorainicioreserva().toLocalTime();
                LocalDateTime fechaHora = LocalDateTime.of(fecha, hora);
                if(ChronoUnit.HOURS.between(now, fechaHora) < 2){
                    return "fuera de plazo";
                }else{
                    reserva.get().setNEstadoreserva("cancelado");
                    reservaRepository.save(reserva.get());
                    int idDisponibilidad = recursoService.getIdDisponibilidad(reserva.get().getFFechareserva(), reserva.get().getFHorainicioreserva());
                    recursoService.crearRecursoDisponibilidad(reserva.get().getKIdrecurso(), idDisponibilidad);
                    return "cancelado";
                }
                
            }else{
                return "reserva no esta en estado reservado";
            }

    }

    public String calificarReserva(String idReserva, int calificacion, Long userId){
        Optional<Reserva> reserva = reservaRepository.findById(idReserva);
        if(reserva.isEmpty()){
            return "reserva no existe";
        }
        if(!reserva.get().getKIdusuario().equals(userId)){
            return "no autorizado";
        }
        if(reserva.get().getNEstadoreserva().equals("finalizado")){
            if(reserva.get().getNCalificacion() == 0){
                if(calificacion > 0 && calificacion <= 5){
                    reserva.get().setNCalificacion(calificacion);
                    reservaRepository.save(reserva.get());
                    return "calificado";
                }else{
                    return "valor invalido";
                }
                
            }else{
                return "reserva ya calificada";
            }
            
        }else{
            return "reserva no ha finalizado";
        }
        
    }
}
