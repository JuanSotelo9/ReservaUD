package com.api.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.backend.dto.request.DisponibilidadRequest;
import com.api.backend.dto.response.DashboardResponse;
import com.api.backend.dto.response.DisponibilidadResponse;
import com.api.backend.dto.response.ReservasPorDiaResponse;
import com.api.backend.dto.response.ReservasPorHoraResponse;
import com.api.backend.dto.response.TopRecursoResponse;
import com.api.backend.exception.BusinessException;
import com.api.backend.exception.ResourceNotFoundException;
import com.api.backend.model.Disponibilidad;
import com.api.backend.model.Poseer;
import com.api.backend.model.PoseerId;
import com.api.backend.model.Recurso;
import com.api.backend.repository.DisponibilidadRepository;
import com.api.backend.repository.PoseerRepository;
import com.api.backend.repository.RecursoRepository;
import com.api.backend.repository.ReservaRepository;
import com.api.backend.repository.TipoRecursoRepository;
import com.api.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RecursoRepository recursoRepository;
    private final TipoRecursoRepository tipoRecursoRepository;
    private final UserRepository userRepository;
    private final ReservaRepository reservaRepository;
    private final DisponibilidadRepository disponibilidadRepository;
    private final PoseerRepository poseerRepository;

    public DashboardResponse getDashboard(){
        Long totalRecursos = recursoRepository.count();
        Long totalTipos = tipoRecursoRepository.count();
        Long totalUsuarios = userRepository.count();
        Long totalReservas = reservaRepository.count();
        Long reservado = reservaRepository.countBynEstadoreserva("reservado");
        Long enProgreso = reservaRepository.countBynEstadoreserva("en progreso");
        Long finalizado = reservaRepository.countBynEstadoreserva("finalizado");
        Long cancelado = reservaRepository.countBynEstadoreserva("cancelado");

        List<TopRecursoResponse> top = reservaRepository.findTopRecursos(PageRequest.of(0, 5)).stream()
            .map(row -> {
                Integer idRecurso = ((Number) row[0]).intValue();
                Long total = ((Number) row[1]).longValue();
                String nombre = recursoRepository.findById(idRecurso)
                    .map(Recurso::getNNombrerecurso)
                    .orElse("Desconocido");
                return new TopRecursoResponse(idRecurso, nombre, total);
            })
            .toList();

        List<ReservasPorDiaResponse> porDia = reservaRepository.countReservasPorDia().stream()
            .map(row -> new ReservasPorDiaResponse((LocalDate) row[0], ((Number) row[1]).longValue()))
            .toList();

        List<ReservasPorHoraResponse> porHora = reservaRepository.countReservasPorHora().stream()
            .map(row -> new ReservasPorHoraResponse(((LocalTime) row[0]).getHour(), ((Number) row[1]).longValue()))
            .toList();

        return new DashboardResponse(
                totalRecursos, totalTipos, totalUsuarios, totalReservas,
                reservado, enProgreso, finalizado, cancelado, top, porDia, porHora);
    }

    public List<DisponibilidadResponse> getDisponibilidades(){
        return disponibilidadRepository.findAll().stream()
            .map(this::toDisponibilidadResponse)
            .toList();
    }

    @Transactional
    public DisponibilidadResponse crearDisponibilidad(DisponibilidadRequest request){
        if(!recursoRepository.existsById(request.idRecurso())){
            throw new ResourceNotFoundException("recurso no existe");
        }
        if(!request.horaInicio().isBefore(request.horaFinal())){
            throw new BusinessException("la hora de inicio debe ser anterior a la hora final");
        }
        if(LocalDateTime.of(request.diaDisponibilidad(), request.horaInicio()).isBefore(LocalDateTime.now())){
            throw new BusinessException("no se puede crear disponibilidad en una franja ya pasada");
        }
        // Cada hora del rango se convierte en un slot de 1 hora
        for(LocalTime hora = request.horaInicio(); hora.isBefore(request.horaFinal()); hora = hora.plusHours(1)){
            if(reservaRepository.countReservasActivas(request.idRecurso(), request.diaDisponibilidad(), hora) > 0){
                throw new BusinessException("el recurso ya tiene una reserva en la franja de las " + hora);
            }
            Disponibilidad disponibilidad = disponibilidadRepository.findByAvailability(request.diaDisponibilidad(), hora);
            if(disponibilidad == null){
                disponibilidad = new Disponibilidad();
                disponibilidad.setFDiadisponibilidad(request.diaDisponibilidad());
                disponibilidad.setFHorainiciodisponibilidad(hora);
                disponibilidad.setFHorafinaldisponibilidad(hora.plusHours(1));
                disponibilidad = disponibilidadRepository.save(disponibilidad);
            }
            if(poseerRepository.consultarDisponibilidad(request.idRecurso(), disponibilidad.getKIddisponibilidad()) == null){
                poseerRepository.save(new Poseer(new PoseerId(request.idRecurso(), disponibilidad.getKIddisponibilidad())));
            }
        }
        return getDisponibilidades().stream()
            .filter(d -> d.dia().equals(request.diaDisponibilidad()) && d.horaInicio().equals(request.horaInicio()))
            .findFirst()
            .orElse(null);
    }

    @Transactional
    public void eliminarDisponibilidad(int id){
        Disponibilidad disponibilidad = disponibilidadRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("disponibilidad no existe"));
        for(Poseer poseer : poseerRepository.findBykIddisponibilidad(id)){
            poseerRepository.delete(poseer);
        }
        disponibilidadRepository.delete(disponibilidad);
    }

    private DisponibilidadResponse toDisponibilidadResponse(Disponibilidad disponibilidad){
        List<String> recursos = poseerRepository.findBykIddisponibilidad(disponibilidad.getKIddisponibilidad()).stream()
            .map(p -> recursoRepository.findById(p.getPoseerId().getKIdrecurso())
                .map(Recurso::getNNombrerecurso)
                .orElse("Desconocido"))
            .toList();
        return new DisponibilidadResponse(
                disponibilidad.getKIddisponibilidad(),
                disponibilidad.getFDiadisponibilidad(),
                disponibilidad.getFHorainiciodisponibilidad(),
                disponibilidad.getFHorafinaldisponibilidad(),
                recursos);
    }
}
