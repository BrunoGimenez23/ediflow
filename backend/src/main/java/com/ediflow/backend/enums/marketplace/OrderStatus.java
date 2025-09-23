package com.ediflow.backend.enums.marketplace;

public enum OrderStatus {
    REQUESTED,       // Solicitud creada
    QUOTED,          // Cotización enviada por proveedor
    ACCEPTED,        // Cotización aceptada por admin
    PAID,            // Pago confirmado
    SCHEDULED,       // Fecha agendada
    IN_PROGRESS,     // Servicio en ejecución
    COMPLETED        // Servicio finalizado y review posible
}
