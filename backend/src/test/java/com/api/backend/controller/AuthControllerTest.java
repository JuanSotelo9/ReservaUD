package com.api.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.api.backend.dto.response.AuthResponse;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerTest {

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.0");

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
        registry.add("jwt.secret",
                () -> "VGVzdFNlY3JldE12SXh6V1RDT0ZmdnBJYkxuTFdBbkFDU2Q2eGlnRzVvVHRJclJtVEdSRXZ5WEJz");
    }

    @Autowired
    private TestRestTemplate restTemplate;

    private static final String CEDULA = "12345678901";
    private static final String USUARIO = "ana.prueba";
    private static final String PASSWORD = "Clave123!";

    @Test
    void shouldRegisterAndLogin() {
        ResponseEntity<AuthResponse> registro = restTemplate.postForEntity(
                "/auth/register",
                Map.of(
                        "id", CEDULA,
                        "nombre", "Ana",
                        "apellido", "Perez",
                        "usuario", USUARIO,
                        "email", "ana.prueba@test.com",
                        "password", PASSWORD),
                AuthResponse.class);

        assertThat(registro.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(registro.getBody()).isNotNull();
        assertThat(registro.getBody().response()).isEqualTo("Success");

        ResponseEntity<AuthResponse> login = restTemplate.postForEntity(
                "/auth/login-user",
                Map.of("usuario", USUARIO, "password", PASSWORD),
                AuthResponse.class);

        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(login.getBody()).isNotNull();
        assertThat(login.getBody().response()).isNotBlank();
        assertThat(login.getBody().id()).isEqualTo(Long.parseLong(CEDULA));
    }

    @Test
    void loginConContrasenaIncorrectaDevuelveForbidden() {
        // 'user' es un usuario sembrado por V3__seed_data.sql (password: 123456)
        ResponseEntity<AuthResponse> login = restTemplate.postForEntity(
                "/auth/login-user",
                Map.of("usuario", "user", "password", "incorrecta"),
                AuthResponse.class);

        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void registerConUsuarioDuplicadoDevuelveBadRequest() {
        // Crear el usuario una primera vez
        restTemplate.postForEntity(
                "/auth/register",
                Map.of(
                        "id", "99988877766",
                        "nombre", "Otro",
                        "apellido", "Usuario",
                        "usuario", "otro.usuario",
                        "email", "otro@test.com",
                        "password", PASSWORD),
                AuthResponse.class);

        // Intentar registrarlo de nuevo -> BusinessException (400)
        ResponseEntity<AuthResponse> duplicado = restTemplate.exchange(
                "/auth/register",
                HttpMethod.POST,
                new HttpEntity<>(Map.of(
                        "id", "99988877766",
                        "nombre", "Otro",
                        "apellido", "Usuario",
                        "usuario", "otro.usuario",
                        "email", "otro@test.com",
                        "password", PASSWORD)),
                AuthResponse.class);

        assertThat(duplicado.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
