package com.api.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.dto.response.TipoRecursoResponse;
import com.api.backend.service.TipoRecursoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tipos")
public class TipoRecursoController {
    
    private final TipoRecursoService tipoRecursoService;

    @GetMapping
    public Page<TipoRecursoResponse> getTiposRecursos(Pageable pageable){
        return tipoRecursoService.getTiposRecurso(pageable);
    }

    @GetMapping("/{id}")
    public TipoRecursoResponse getTipoRecurso(@PathVariable int id){
        return tipoRecursoService.getTipoRecurso(id);
    }

}
