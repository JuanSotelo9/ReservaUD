package com.api.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.dto.response.RecursoResponse;
import com.api.backend.service.RecursoService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/recursos")
public class RecursoController {
    
    private final RecursoService recursoService;

    @GetMapping
    public List<RecursoResponse> getRecursos(){
        return recursoService.getRecursos();
    }

    @GetMapping("/{id}")
    public Optional<RecursoResponse> getRecurso(@PathVariable int id){
        return recursoService.getRecurso(id);
    }
    
    @GetMapping("/tipo/{id}")
    public List<RecursoResponse> getRecursosByTipo(@PathVariable int id){
        return recursoService.getRecursosByTipo(id);
    }
}
