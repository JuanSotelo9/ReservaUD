package com.api.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.api.backend.dto.request.ReservaRequest;
import com.api.backend.dto.response.ReservaResponse;
import com.api.backend.exception.BusinessException;
import com.api.backend.exception.ResourceNotFoundException;
import com.api.backend.exception.UnauthorizedException;
import com.api.backend.model.Reserva;
import com.api.backend.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservaService {
    
    private final ReservaRepository reservaRepository;
    private final RecursoService recursoService;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");


    public boolean reservarRecurso(ReservaRequest request){
        Reserva reserva = new Reserva();
        reserva.setKIdreserva(this.generarId());
        reserva.setFFechareserva(request.dia());
        reserva.setFHorafinalreserva(request.horaFinal());
        reserva.setFHorainicioreserva(request.horaInicio());
        reserva.setNEstadoreserva("reservado");
        reserva.setKIdusuario(request.idUsuario());
        reserva.setKIdrecurso(request.idRecurso());
        reserva.setNCalificacion(0);
        try {
            reservaRepository.save(reserva);
            return true;
        } catch (Exception e) {
            throw new BusinessException("no se pudo realizar la reserva");
        }
    }
    
    private String generarId(){
        LocalDateTime now = LocalDateTime.now();
        return now.format(formatter);
    }

    public List<ReservaResponse> getReservas(Long idUser){
        return reservaRepository.findBykIdusuario(idUser)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public ReservaResponse toResponse(Reserva reserva){
        return new ReservaResponse(
            reserva.getKIdreserva(),
            reserva.getFHorainicioreserva(),
            reserva.getFHorafinalreserva(),
            reserva.getFFechareserva(),
            reserva.getNEstadoreserva(),
            reserva.getKIdusuario(),
            reserva.getKIdrecurso(),
            reserva.getNCalificacion()
        );
    }

    public String cancelarReserva(String idReserva, Long userId){
        Reserva reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new ResourceNotFoundException("reserva no existe"));

        if(!reserva.getKIdusuario().equals(userId)){
            throw new UnauthorizedException("no autorizado");
        }

        if(reserva.getNEstadoreserva().equals("reservado")){
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime fechaHora = LocalDateTime.of(reserva.getFFechareserva(), reserva.getFHorainicioreserva());
            if(ChronoUnit.HOURS.between(now, fechaHora) < 2){
                throw new BusinessException("fuera de plazo");
            }
            reserva.setNEstadoreserva("cancelado");
            reservaRepository.save(reserva);
            recursoService.restaurarDisponibilidad(reserva.getKIdrecurso(), reserva.getFFechareserva(), reserva.getFHorainicioreserva(), reserva.getFHorafinalreserva());
            return "cancelado";
        }
        throw new BusinessException("reserva no esta en estado reservado");
    }

    public String calificarReserva(String idReserva, int calificacion, Long userId){
        Reserva reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new ResourceNotFoundException("reserva no existe"));

        if(!reserva.getKIdusuario().equals(userId)){
            throw new UnauthorizedException("no autorizado");
        }

        if(!reserva.getNEstadoreserva().equals("finalizado")){
            throw new BusinessException("reserva no ha finalizado");
        }

        if(reserva.getNCalificacion() != 0){
            throw new BusinessException("reserva ya calificada");
        }

        if(calificacion <= 0 || calificacion > 5){
            throw new BusinessException("valor invalido");
        }

        reserva.setNCalificacion(calificacion);
        reservaRepository.save(reserva);
        return "calificado";
    }
}
