package com.ediflow.backend.service;

import com.ediflow.backend.entity.LogEntry;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.EntryType;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

class NotificationServiceTest {

    @Test
    void testNotifyResidentNewLogEntry() {
        // Creamos un mock del JavaMailSender
        JavaMailSender mailSender = Mockito.mock(JavaMailSender.class);

        NotificationService notificationService = new NotificationService(mailSender);

        // Simulamos un residente
        Resident resident = new Resident();
        User user = new User();
        user.setEmail("tu-correo-mailtrap@inbox.mailtrap.io");
        user.setFullName("Juan Pérez");
        resident.setUser(user);

        // Creamos un registro de portería
        LogEntry entry = new LogEntry();
        entry.setType(EntryType.PAQUETE);
        entry.setDescription("Paquete de Amazon");
        entry.setCreatedAt(LocalDateTime.now());

        // Llamamos al método
        notificationService.notifyResidentNewLogEntry(resident, entry);

        // Capturamos el SimpleMailMessage enviado
        ArgumentCaptor<SimpleMailMessage> mailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        Mockito.verify(mailSender).send(mailCaptor.capture());

        SimpleMailMessage sentMessage = mailCaptor.getValue();

        // Verificamos destinatario, asunto y contenido
        assertThat(sentMessage.getTo()).containsExactly("tu-correo-mailtrap@inbox.mailtrap.io");
        assertThat(sentMessage.getSubject()).contains("Nuevo registro de portería"); // Ajusta según tu asunto real
        assertThat(sentMessage.getText()).contains("Paquete de Amazon", "Juan Pérez"); // Ajusta según el contenido real
    }
}