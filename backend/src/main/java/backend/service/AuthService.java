package backend.service;

import backend.DTO.LoginRequest;
import backend.DTO.RegisterRequest;
import backend.DTO.AuthResponse;

public interface AuthService {
    AuthResponse authenticateUser(LoginRequest loginRequest);
    AuthResponse registerUser(RegisterRequest registerRequest);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
}