package backend.service.impl;

import backend.DTO.AuthResponse;
import backend.DTO.LoginRequest;
import backend.DTO.RegisterRequest;
import backend.entity.PasswordResetToken;
import backend.model.User;
import backend.repository.PasswordResetTokenRepository;
import backend.repository.UserRepository;
import backend.security.JwtUtils;
import backend.service.AuthService;
import backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getUsernameOrEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsernameOrEmail(),
                    loginRequest.getPassword()
                )
            );

            log.info("Authentication successful for user: {}", loginRequest.getUsernameOrEmail());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            return new AuthResponse(jwt);
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsernameOrEmail());
            throw new BadCredentialsException("Invalid username/email or password");
        } catch (Exception e) {
            log.error("Authentication failed for user: {} - Error: {}", loginRequest.getUsernameOrEmail(), e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        log.info("Attempting to register new user: {}", registerRequest.getUsername());
        
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            log.error("Username already taken: {}", registerRequest.getUsername());
            throw new IllegalArgumentException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            log.error("Email already in use: {}", registerRequest.getEmail());
            throw new IllegalArgumentException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    registerRequest.getUsername(),
                    registerRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            return new AuthResponse(jwt);
        } catch (Exception e) {
            log.error("Failed to authenticate after registration for user: {} - Error: {}", 
                registerRequest.getUsername(), e.getMessage());
            throw new RuntimeException("Failed to authenticate after registration: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        log.info("Processing forgot password request for email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("No user found with this email address"));

        log.debug("Frontend URL for password reset: {}", frontendUrl);

        // Delete any existing reset tokens for this user
        passwordResetTokenRepository.deleteByUser_Id(user.getId());

        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(resetToken);

        // Generate reset link
        String resetLink = String.format("%s/reset-password?token=%s", frontendUrl, token);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        
        log.info("Password reset token generated and email sent for user: {}", user.getEmail());
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Processing password reset request for token");
        
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("Password reset token has expired");
        }

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("Password reset token has already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }
} 