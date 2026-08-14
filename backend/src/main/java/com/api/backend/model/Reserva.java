package com.api.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reserva")
public class Reserva {
    
    @Id
    String kIdreserva;

    LocalTime fHorainicioreserva;
    LocalTime fHorafinalreserva;
    LocalDate fFechareserva;
    String nEstadoreserva;
    Long kIdusuario;
    int kIdrecurso;
    int nCalificacion;
}
