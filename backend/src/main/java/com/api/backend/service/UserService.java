package com.api.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.api.backend.dto.response.ReservaResponse;
import com.api.backend.dto.response.UserResponse;
import com.api.backend.model.User;
import com.api.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ReservaService reservaService;

    public UserResponse getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        List<ReservaResponse> historial = reservaService.getReservas(id);
        if(user.isPresent()){
            return new UserResponse(user.get().getKIdusuario(), user.get().getNNombre(), user.get().getNUsuario(),
            user.get().getNEmail(), historial);
        }else{
            return null;
        }
        
    }

}
