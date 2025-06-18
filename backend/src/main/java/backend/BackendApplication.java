package backend;

import backend.security.JwtUtils;
import backend.security.UserDetailsImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Collections;

@SpringBootApplication
@ComponentScan(basePackages = "backend")
@EnableJpaRepositories(basePackages = "backend.repository")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner testJwt(JwtUtils jwtUtils) {
		return args -> {
			// Create a proper UserDetailsImpl object for testing
			UserDetailsImpl userDetails = new UserDetailsImpl(
					1L, // id
					"testuser", // username
					"test@example.com", // email
					"password", // password (won't be used)
					Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")) // authorities
			);

			// Create authentication with the UserDetailsImpl as principal
			Authentication auth = new UsernamePasswordAuthenticationToken(
					userDetails,
					null,
					userDetails.getAuthorities()
			);

			// Test token generation/validation
			String token = jwtUtils.generateJwtToken(auth);
			System.out.println("Generated token: " + token);

			boolean isValid = jwtUtils.validateJwtToken(token);
			System.out.println("Token valid: " + isValid);
		};
	}
}