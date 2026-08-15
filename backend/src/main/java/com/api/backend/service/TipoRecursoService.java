package com.api.backend.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.api.backend.dto.request.TipoRecursoRequest;
import com.api.backend.dto.response.TipoRecursoResponse;
import com.api.backend.exception.BusinessException;
import com.api.backend.exception.ResourceNotFoundException;
import com.api.backend.model.TipoRecurso;
import com.api.backend.repository.TipoRecursoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TipoRecursoService {
    
    private final TipoRecursoRepository tipoRecursoRepository;

    private static final Map<String, String> SORT_FIELDS = Map.of(
        "id", "kIdtiporecurso",
        "nombre", "nNombretiporecurso",
        "descripcion", "nDescripciontiporecurso",
        "imagen", "nImagen"
    );

    public TipoRecursoResponse getTipoRecurso(int id){
        return tipoRecursoRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("tipo de recurso no existe"));
    }

    public Page<TipoRecursoResponse> getTiposRecurso(Pageable pageable){
        return tipoRecursoRepository.findAll(mappedPageable(pageable)).map(this::toResponse);
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

    public TipoRecursoResponse toResponse(TipoRecurso tipoRecurso){
        return new TipoRecursoResponse(
            tipoRecurso.getKIdtiporecurso(),
            tipoRecurso.getNNombretiporecurso(),
            tipoRecurso.getNDescripciontiporecurso(),
            tipoRecurso.getNImagen()
        );
    }

    public TipoRecursoResponse crearTipoRecurso(TipoRecursoRequest request){
        TipoRecurso tipoRecurso = new TipoRecurso();
        tipoRecurso.setNNombretiporecurso(request.nombre());
        tipoRecurso.setNDescripciontiporecurso(request.descripcion());
        tipoRecurso.setNImagen(request.imagen());
        return toResponse(tipoRecursoRepository.save(tipoRecurso));
    }

    public TipoRecursoResponse actualizarTipoRecurso(int id, TipoRecursoRequest request){
        TipoRecurso tipoRecurso = tipoRecursoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("tipo de recurso no existe"));
        tipoRecurso.setNNombretiporecurso(request.nombre());
        tipoRecurso.setNDescripciontiporecurso(request.descripcion());
        tipoRecurso.setNImagen(request.imagen());
        return toResponse(tipoRecursoRepository.save(tipoRecurso));
    }

    public void eliminarTipoRecurso(int id){
        TipoRecurso tipoRecurso = tipoRecursoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("tipo de recurso no existe"));
        try {
            tipoRecursoRepository.delete(tipoRecurso);
        } catch (Exception e) {
            throw new BusinessException("no se pudo eliminar: el tipo tiene recursos asociados");
        }
    }
}
