package com.api.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.api.backend.model.AuthResponse;
import com.api.backend.model.LoginRequest;
import com.api.backend.model.RegisterRequest;
import com.api.backend.model.Role;
import com.api.backend.model.User;
import com.api.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse loginUser(LoginRequest request){
        
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsuario(), request.getPassword()));
            User user = userRepository.findBynUsuario(request.getUsuario()).orElseThrow();
            String token = jwtService.getToken(user);
            return AuthResponse.builder()
                .response(token)
                .id(user.getKIdusuario())
                .build();
        }catch(Exception e){
            return AuthResponse.builder()
            .response("Datos Incorrectos")
            .id(null)
            .build(); 
        }
        
    }

    public AuthResponse register(RegisterRequest request){
        try{
            if(!userRepository.existsById(Long.parseLong(request.getId()))){
                if(!userRepository.findBynUsuario(request.getUsuario()).isPresent()){
                    if(!userRepository.findBynEmail(request.getEmail()).isPresent()){
                        User user = User.builder()
                        .kIdusuario(Long.parseLong(request.getId()))
                        .nNombre(request.getNombre() + " " + request.getApellido())
                        .nUsuario(request.getUsuario())
                        .nEmail(request.getEmail())
                        .nPassword(passwordEncoder.encode(request.getPassword()))
                        .role(Role.ROLE_USER)
                        .build();
                        userRepository.save(user);
                        return AuthResponse.builder()
                        .response("Success")
                        .id(null)
                        .build();
                    }else{
                        return AuthResponse.builder()
                        .response("correo ya registrado")
                        .id(null)
                        .build();
                    }
                    
                }else{
                    return AuthResponse.builder()
                    .response("usuario ya registrado")
                    .id(null)
                    .build();
                }
                
            }else{
                return AuthResponse.builder()
                .response("id ya registrado")
                .id(null)
                .build();
            }
            
        }catch(Exception e){
            return AuthResponse.builder()
            .response("Error")
            .id(null)
            .build();

        }
    }
}
