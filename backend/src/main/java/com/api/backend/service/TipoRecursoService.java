package com.api.backend.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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

    public boolean saveTipoRecurso(TipoRecurso tipoRecurso){
        try {
            tipoRecursoRepository.save(tipoRecurso);
            return true;
        } catch (Exception e) {
            throw new BusinessException("no se pudo guardar el tipo de recurso");
        }
    }

    public boolean deleteTipoRecurso(TipoRecurso tipoRecurso){
        if(!tipoRecursoRepository.existsById(tipoRecurso.getKIdtiporecurso())){
            throw new ResourceNotFoundException("tipo de recurso no existe");
        }
        tipoRecursoRepository.delete(tipoRecurso);
        return true;
    }
}
