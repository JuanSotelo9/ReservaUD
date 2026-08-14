package com.api.backend.service;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.backend.dto.request.DisponibilidadRequest;
import com.api.backend.dto.response.RecursoResponse;
import com.api.backend.exception.BusinessException;
import com.api.backend.exception.ResourceNotFoundException;
import com.api.backend.model.Disponibilidad;
import com.api.backend.model.Poseer;
import com.api.backend.model.PoseerId;
import com.api.backend.model.Recurso;
import com.api.backend.model.TipoRecurso;
import com.api.backend.repository.DisponibilidadRepository;
import com.api.backend.repository.PoseerRepository;
import com.api.backend.repository.RecursoRepository;
import com.api.backend.repository.ReservaRepository;
import com.api.backend.repository.TipoRecursoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecursoService {
    
    private final RecursoRepository recursoRepository;
    private final DisponibilidadRepository disponibilidadRepository;
    private final PoseerRepository poseerRepository;
    private final ReservaRepository reservaRepository;
    private final TipoRecursoRepository tipoRecursoRepository;

    public Optional<RecursoResponse> getRecurso(int id){
        Optional<Recurso> recurso = recursoRepository.findById(id);
        if(recurso.isPresent()){
            return Optional.of(toResponse(recurso.get()));
        }else{
            return Optional.empty();
        }
        
    }

    public List<RecursoResponse> getRecursosByTipo(int tipoRecurso){
        return recursoRepository.findBykIdtiporecurso(tipoRecurso)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<RecursoResponse> getRecursos(){
        return recursoRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public RecursoResponse toResponse(Recurso recurso){
        String nombreTipoRecurso = null;
        Optional<TipoRecurso> tipoRecurso = tipoRecursoRepository.findById(recurso.getKIdtiporecurso());
        if(tipoRecurso.isPresent()){
            nombreTipoRecurso = tipoRecurso.get().getNNombretiporecurso();
        }
        return new RecursoResponse(
            recurso.getKIdrecurso(),
            recurso.getNNombrerecurso(),
            recurso.getNDescripcionrecurso(),
            recurso.getKIdtiporecurso(),
            nombreTipoRecurso,
            calificacionPromedio(recurso.getKIdrecurso())
        );
    }

    public boolean saveRecurso(Recurso recurso){
        try {
            recursoRepository.save(recurso);
            return true;
        } catch (Exception e) {
            throw new BusinessException("no se pudo guardar el recurso");
        }
    }

    public boolean deleteRecurso(Recurso recurso){
        if(!recursoRepository.existsById(recurso.getKIdrecurso())){
            throw new ResourceNotFoundException("recurso no existe");
        }
        recursoRepository.delete(recurso);
        return true;
    }

    public boolean consultarDisponibilidad(DisponibilidadRequest request){
        if(request.horaInicio().getTime() < request.horaFinal().getTime()){
            for(long hora = request.horaInicio().getTime(); hora < request.horaFinal().getTime(); hora= hora+3600000){
                Disponibilidad disponibilidad = disponibilidadRepository.findByAvailability(request.diaDisponibilidad(), new Time(hora));
                if(!(disponibilidad != null && poseerRepository.consultarDisponibilidad(request.idRecurso(), disponibilidad.getKIddisponibilidad()) != null)){
                    return false;
                }
            }
            
            return true;
        }else{
            return false;
        }
        
    }

    public int getIdDisponibilidad(Date dia, Time horaInicio){
        return disponibilidadRepository.findByAvailability(dia, horaInicio).getKIddisponibilidad();
    }

    public void crearRecursoDisponibilidad(int idRecurso, int idDisponibilidad){
        poseerRepository.save(new Poseer(new PoseerId(idRecurso, idDisponibilidad)));
    }

    @Transactional
    public void deleteDisponibilidad(int idRecurso, Date dia, Time horaInicio, Time horaFinal){
        for(long hora = horaInicio.getTime(); hora < horaFinal.getTime(); hora= hora+3600000){
            Disponibilidad disponibilidad = disponibilidadRepository.findByAvailability(dia, new Time(hora));
            poseerRepository.deleteDisponibilidad(idRecurso, disponibilidad.getKIddisponibilidad());
        }
        
    }

    public float calificacionPromedio(int idRecurso){
        List<Integer> calificaciones = reservaRepository.findCalificacion(idRecurso, "finalizado");
        float promedio = 0;
        if(calificaciones.isEmpty()){
            return promedio;
        }else{
            for(int numero : calificaciones){
                promedio += numero;
            }
            promedio /= calificaciones.size();
            String format = String.format("%.1f", promedio);
            format = format.replace(",", ".");
            return Float.parseFloat(format);
        }
    }
}
