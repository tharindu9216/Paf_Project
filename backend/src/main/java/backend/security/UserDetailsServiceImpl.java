package backend.security;

import backend.model.User;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.info("Attempting to load user with username/email: {}", usernameOrEmail);
        
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> {
                    log.info("User not found by email, trying username");
                    return userRepository.findByUsername(usernameOrEmail)
                            .orElseThrow(() -> {
                                log.error("User not found with username or email: {}", usernameOrEmail);
                                return new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
                            });
                });

        log.info("User found: {}", user.getUsername());
        return UserDetailsImpl.build(user);
    }
}