package com.api.backend.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SerCaracterisadoId implements Serializable {
    
    int kIdrecurso;
    int kIdcaracteristicas;
}
