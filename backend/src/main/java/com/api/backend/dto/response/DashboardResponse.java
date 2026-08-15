package com.api.backend.dto.response;

import java.util.List;

public record DashboardResponse(
        Long totalRecursos,
        Long totalTipos,
        Long totalUsuarios,
        Long totalReservas,
        Long reservasReservado,
        Long reservasEnProgreso,
        Long reservasFinalizadas,
        Long reservasCanceladas,
        List<TopRecursoResponse> recursosMasReservados,
        List<ReservasPorDiaResponse> reservasPorDia,
        List<ReservasPorHoraResponse> reservasPorHora) {
}
