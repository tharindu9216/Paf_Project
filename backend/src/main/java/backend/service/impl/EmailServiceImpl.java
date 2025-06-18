package backend.service.impl;

import backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Password Reset Request");
            
            String content = String.format(
                "Hello,<br><br>" +
                "You have requested to reset your password. Please click the link below to reset your password:<br><br>" +
                "<a href='%s'>Reset Password</a><br><br>" +
                "This link will expire in 24 hours.<br><br>" +
                "If you did not request this password reset, please ignore this email.<br><br>" +
                "Best regards,<br>" +
                "Your App Team",
                resetLink
            );

            helper.setText(content, true);
            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {} - Error: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
} 