package com.api.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.api.backend.dto.request.LoginRequest;
import com.api.backend.dto.request.RegisterRequest;
import com.api.backend.dto.response.AuthResponse;
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
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.usuario(), request.password()));
            User user = userRepository.findBynUsuario(request.usuario()).orElseThrow();
            String token = jwtService.getToken(user);
            return new AuthResponse(token, user.getKIdusuario());
        }catch(Exception e){
            return new AuthResponse("Datos Incorrectos", null);
        }
        
    }

    public AuthResponse register(RegisterRequest request){
        try{
            if(!userRepository.existsById(Long.parseLong(request.id()))){
                if(!userRepository.findBynUsuario(request.usuario()).isPresent()){
                    if(!userRepository.findBynEmail(request.email()).isPresent()){
                        User user = User.builder()
                        .kIdusuario(Long.parseLong(request.id()))
                        .nNombre(request.nombre() + " " + request.apellido())
                        .nUsuario(request.usuario())
                        .nEmail(request.email())
                        .nPassword(passwordEncoder.encode(request.password()))
                        .role(Role.ROLE_USER)
                        .build();
                        userRepository.save(user);
                        return new AuthResponse("Success", null);
                    }else{
                        return new AuthResponse("correo ya registrado", null);
                    }
                    
                }else{
                    return new AuthResponse("usuario ya registrado", null);
                }
                
            }else{
                return new AuthResponse("id ya registrado", null);
            }
            
        }catch(Exception e){
            return new AuthResponse("Error", null);

        }
    }
}
