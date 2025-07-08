package com.ediflow.backend.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Map<String, String>> buildResponse(String message, HttpStatus status) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFormatException(InvalidFormatException ex) {

        if (ex.getTargetType().isEnum()) {
            String enumName = ex.getTargetType().getSimpleName();
            String invalidValue = ex.getValue().toString();
            String message = "Valor inválido para el enum '" + enumName + "': '" + invalidValue + "'. Por favor usa uno válido.";
            return buildResponse(message, HttpStatus.BAD_REQUEST);
        }

        if (ex.getTargetType().equals(Long.class)) {
            return buildResponse("El valor proporcionado para un campo numérico es inválido. Asegúrese de ingresar un número válido.", HttpStatus.BAD_REQUEST);
        }

        return buildResponse("Error de formato: " + ex.getOriginalMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {

        Throwable rootCause = ExceptionUtils.getRootCause(ex);
        String rootMessage = rootCause != null ? rootCause.getMessage() : ex.getMessage();

        String mensaje = "No se puede completar la operación debido a una restricción de integridad de datos.";

        if (rootMessage != null) {
            if (rootMessage.contains("common_area_reservation")) {
                mensaje = "No se puede eliminar el área común porque tiene reservas asociadas.";
            } else if (rootMessage.contains("resident")) {
                mensaje = "No se puede eliminar el residente porque tiene reservas u otros datos asociados.";
            }
        }

        return buildResponse(mensaje, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return buildResponse("Error inesperado: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
