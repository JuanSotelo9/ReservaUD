package com.api.backend.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

public record DisponibilidadRequest(
        LocalDate diaDisponibilidad,
        LocalTime horaInicio,
        LocalTime horaFinal,
        int idRecurso) {
}
