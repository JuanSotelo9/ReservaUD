package com.api.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    private static final Map<String, String> SORT_FIELDS = Map.of(
        "id", "kIdrecurso",
        "nombre", "nNombrerecurso",
        "descripcion", "nDescripcionrecurso",
        "idTipoRecurso", "kIdtiporecurso"
    );

    public RecursoResponse getRecurso(int id){
        Recurso recurso = recursoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("recurso no existe"));
        return toResponse(recurso);
    }

    public List<RecursoResponse> getRecursosByTipo(int tipoRecurso){
        return recursoRepository.findBykIdtiporecurso(tipoRecurso)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public Page<RecursoResponse> getRecursos(Pageable pageable){
        return recursoRepository.findAll(mappedPageable(pageable)).map(this::toResponse);
    }

    private Pageable mappedPageable(Pageable pageable){
        if(pageable.getSort().isUnsorted()){
            return pageable;
        }
        List<Sort.Order> orders = pageable.getSort().stream()
            .map(order -> order.withProperty(SORT_FIELDS.getOrDefault(order.getProperty(), order.getProperty())))
            .toList();
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(orders));
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
        if(request.horaInicio().isBefore(request.horaFinal())){
            for(LocalTime hora = request.horaInicio(); hora.isBefore(request.horaFinal()); hora = hora.plusHours(1)){
                Disponibilidad disponibilidad = disponibilidadRepository.findByAvailability(request.diaDisponibilidad(), hora);
                if(!(disponibilidad != null && poseerRepository.consultarDisponibilidad(request.idRecurso(), disponibilidad.getKIddisponibilidad()) != null)){
                    return false;
                }
            }
            
            return true;
        }else{
            return false;
        }
        
    }

    @Transactional
    public void deleteDisponibilidad(int idRecurso, LocalDate dia, LocalTime horaInicio, LocalTime horaFinal){
        for(LocalTime hora = horaInicio; hora.isBefore(horaFinal); hora = hora.plusHours(1)){
            Disponibilidad disponibilidad = disponibilidadRepository.findByAvailability(dia, hora);
            poseerRepository.deleteDisponibilidad(idRecurso, disponibilidad.getKIddisponibilidad());
        }
        
    }

    @Transactional
    public void restaurarDisponibilidad(int idRecurso, LocalDate dia, LocalTime horaInicio, LocalTime horaFinal){
        for(LocalTime hora = horaInicio; hora.isBefore(horaFinal); hora = hora.plusHours(1)){
            Disponibilidad disponibilidad = disponibilidadRepository.findByAvailability(dia, hora);
            if(disponibilidad != null && poseerRepository.consultarDisponibilidad(idRecurso, disponibilidad.getKIddisponibilidad()) == null){
                poseerRepository.save(new Poseer(new PoseerId(idRecurso, disponibilidad.getKIddisponibilidad())));
            }
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
