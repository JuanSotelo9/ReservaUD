package com.api.backend.dto.request;

import java.sql.Date;
import java.sql.Time;

public record DisponibilidadRequest(
        Date diaDisponibilidad,
        Time horaInicio,
        Time horaFinal,
        int idRecurso) {
}
