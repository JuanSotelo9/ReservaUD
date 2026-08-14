package com.api.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.dto.request.DisponibilidadRequest;
import com.api.backend.dto.response.RecursoResponse;
import com.api.backend.service.RecursoService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/recursos")
public class RecursoController {
    
    private final RecursoService recursoService;

    @GetMapping
    public Page<RecursoResponse> getRecursos(Pageable pageable){
        return recursoService.getRecursos(pageable);
    }

    @GetMapping("/{id}")
    public RecursoResponse getRecurso(@PathVariable int id){
        return recursoService.getRecurso(id);
    }
    
    @GetMapping("/tipo/{id}")
    public List<RecursoResponse> getRecursosByTipo(@PathVariable int id){
        return recursoService.getRecursosByTipo(id);
    }

    @PostMapping("/disponibilidad")
    public boolean getDisponibilidad(@RequestBody DisponibilidadRequest request){
        return recursoService.consultarDisponibilidad(request);
    }
}
