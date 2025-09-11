package com.ediflow.backend.service;

import com.ediflow.backend.entity.LogEntry;
import com.ediflow.backend.entity.Resident;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void notifyResidentNewLogEntry(Resident resident, LogEntry entry) {
        if (resident.getUser() == null || resident.getUser().getEmail() == null) {
            System.out.println("⚠️ No se envió mail porque el residente no tiene usuario o email");
            return;
        }

        String to = resident.getUser().getEmail();
        String subject = "Nuevo registro de portería";
        String text = String.format(
                "Hola %s,\n\nSe registró en portería:\n- %s\n\nTipo: %s\nFecha: %s\n\nSaludos,\nEdiflow",
                resident.getUser().getFullName(),
                entry.getDescription() == null ? "(sin descripción)" : entry.getDescription(),
                entry.getType(),
                entry.getCreatedAt().toString()
        );

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("Ediflow <MS_iajfFK@ediflow.uy>");
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);

        mailSender.send(msg);
    }
}
