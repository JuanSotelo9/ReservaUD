package com.api.backend.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record DisponibilidadResponse(
        Integer id,
        LocalDate dia,
        LocalTime horaInicio,
        LocalTime horaFinal,
        List<String> recursos) {
}
