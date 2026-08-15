package com.api.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

import com.api.backend.dto.request.DisponibilidadRequest;
import com.api.backend.dto.request.RecursoRequest;
import com.api.backend.dto.response.RecursoResponse;
import com.api.backend.exception.BusinessException;
import com.api.backend.exception.ResourceNotFoundException;
import com.api.backend.model.Caracteristica;
import com.api.backend.model.Disponibilidad;
import com.api.backend.model.Poseer;
import com.api.backend.model.PoseerId;
import com.api.backend.model.Recurso;
import com.api.backend.model.TipoRecurso;
import com.api.backend.repository.CaracteristicaRepository;
import com.api.backend.repository.DisponibilidadRepository;
import com.api.backend.repository.PoseerRepository;
import com.api.backend.repository.RecursoRepository;
import com.api.backend.repository.ReservaRepository;
import com.api.backend.repository.SerCaracterisadoRepository;
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
    private final CaracteristicaRepository caracteristicaRepository;
    private final SerCaracterisadoRepository serCaracterisadoRepository;

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

    public Page<RecursoResponse> getRecursos(String q, Integer tipo, LocalDate disponible, Pageable pageable){
        Specification<Recurso> spec = filtros(q, tipo, disponible);
        boolean ordenarPorRating = pageable.getSort().get().anyMatch(o -> o.getProperty().equals("calificacionPromedio"));

        if(ordenarPorRating){
            List<RecursoResponse> todos = recursoRepository.findAll(spec).stream()
                .map(this::toResponse)
                .toList();
            Comparator<RecursoResponse> comparador = Comparator.comparing(RecursoResponse::calificacionPromedio);
            if(pageable.getSort().getOrderFor("calificacionPromedio").getDirection() == Sort.Direction.DESC){
                comparador = comparador.reversed();
            }
            todos = todos.stream().sorted(comparador).toList();
            int inicio = (int) Math.min((long) pageable.getOffset(), todos.size());
            int fin = (int) Math.min(inicio + pageable.getPageSize(), todos.size());
            return new PageImpl<>(todos.subList(inicio, fin), pageable, todos.size());
        }

        return recursoRepository.findAll(spec, mappedPageable(pageable)).map(this::toResponse);
    }

    private Specification<Recurso> filtros(String q, Integer tipo, LocalDate disponible){
        return (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();
            if(q != null && !q.isBlank()){
                predicados.add(cb.like(cb.lower(root.get("nNombrerecurso")), "%" + q.toLowerCase() + "%"));
            }
            if(tipo != null){
                predicados.add(cb.equal(root.get("kIdtiporecurso"), tipo));
            }
            if(disponible != null){
                Subquery<Integer> poseerSub = query.subquery(Integer.class);
                Root<Poseer> poseerRoot = poseerSub.from(Poseer.class);
                Subquery<Integer> dispSub = poseerSub.subquery(Integer.class);
                Root<Disponibilidad> dispRoot = dispSub.from(Disponibilidad.class);
                dispSub.select(dispRoot.get("kIddisponibilidad"))
                    .where(cb.equal(dispRoot.get("fDiadisponibilidad"), disponible));
                poseerSub.select(poseerRoot.get("poseerId").get("kIdrecurso"))
                    .where(
                        cb.equal(poseerRoot.get("poseerId").get("kIdrecurso"), root.get("kIdrecurso")),
                        poseerRoot.get("poseerId").get("kIddisponibilidad").in(dispSub));
                predicados.add(cb.exists(poseerSub));
            }
            return cb.and(predicados.toArray(new Predicate[0]));
        };
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
        List<String> caracteristicas = caracteristicaRepository
            .findAllById(serCaracterisadoRepository.findCaracteristicaIdsByRecurso(recurso.getKIdrecurso()))
            .stream()
            .map(Caracteristica::getNDescripcioncaracteristica)
            .toList();
        return new RecursoResponse(
            recurso.getKIdrecurso(),
            recurso.getNNombrerecurso(),
            recurso.getNDescripcionrecurso(),
            recurso.getKIdtiporecurso(),
            nombreTipoRecurso,
            calificacionPromedio(recurso.getKIdrecurso()),
            caracteristicas
        );
    }

    public RecursoResponse crearRecurso(RecursoRequest request){
        validarTipoRecurso(request.idTipoRecurso());
        Recurso recurso = new Recurso();
        recurso.setNNombrerecurso(request.nombre());
        recurso.setNDescripcionrecurso(request.descripcion());
        recurso.setKIdtiporecurso(request.idTipoRecurso());
        return toResponse(recursoRepository.save(recurso));
    }

    public RecursoResponse actualizarRecurso(int id, RecursoRequest request){
        Recurso recurso = recursoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("recurso no existe"));
        validarTipoRecurso(request.idTipoRecurso());
        recurso.setNNombrerecurso(request.nombre());
        recurso.setNDescripcionrecurso(request.descripcion());
        recurso.setKIdtiporecurso(request.idTipoRecurso());
        return toResponse(recursoRepository.save(recurso));
    }

    public void eliminarRecurso(int id){
        Recurso recurso = recursoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("recurso no existe"));
        try {
            recursoRepository.delete(recurso);
        } catch (Exception e) {
            throw new BusinessException("no se pudo eliminar: el recurso tiene reservas u horarios asociados");
        }
    }

    private void validarTipoRecurso(Integer idTipoRecurso){
        if(idTipoRecurso == null || !tipoRecursoRepository.existsById(idTipoRecurso)){
            throw new BusinessException("tipo de recurso no existe");
        }
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
