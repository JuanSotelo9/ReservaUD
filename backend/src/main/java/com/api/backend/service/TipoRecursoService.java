package com.api.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.api.backend.dto.response.TipoRecursoResponse;
import com.api.backend.model.TipoRecurso;
import com.api.backend.repository.TipoRecursoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TipoRecursoService {
    
    private final TipoRecursoRepository tipoRecursoRepository;

    public Optional<TipoRecursoResponse> getTipoRecurso(int id){
        return tipoRecursoRepository.findById(id).map(this::toResponse);
    }

    public List<TipoRecursoResponse> getTiposRecurso(){
        return tipoRecursoRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
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
        return tipoRecursoRepository.save(tipoRecurso) != null;
    }

    public boolean deleteTipoRecurso(TipoRecurso tipoRecurso){
        if(tipoRecursoRepository.existsById(tipoRecurso.getKIdtiporecurso())){
            tipoRecursoRepository.delete(tipoRecurso);
            return true;
        }else{
            return false;
        }
    }
}
