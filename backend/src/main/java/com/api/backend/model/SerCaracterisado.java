package com.api.backend.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ser_caracterisado")
public class SerCaracterisado {
    
    @EmbeddedId
    SerCaracterisadoId serCaracterisadoId;
}
