package vn.id.luannv.auth_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.id.luannv.auth_service.config.JwtUtil;
import vn.id.luannv.auth_service.dto.request.LoginRequest;
import vn.id.luannv.auth_service.dto.request.RegisterRequest;
import vn.id.luannv.auth_service.dto.response.AuthResponse;
import vn.id.luannv.auth_service.dto.response.UserResponse;
import vn.id.luannv.auth_service.entity.Role;
import vn.id.luannv.auth_service.entity.User;
import vn.id.luannv.auth_service.entity.UserStatus;
import vn.id.luannv.auth_service.exception.BusinessException;
import vn.id.luannv.auth_service.repository.UserRepository;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final BlacklistService blacklistService;

    public UserResponse register(RegisterRequest request) {
        return userService.createUser(request);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("Invalid username or password");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("User is not active");
        }

        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .id(user.getId())
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.joining(",")))
                .status(user.getStatus().toString())
                .build();
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public String logout(String token) {
        Instant expiry = jwtUtil.extractAllClaims(token).getExpiration().toInstant();
        blacklistService.blacklistToken(token, expiry);
        return "Logged out successfully";
    }

}
