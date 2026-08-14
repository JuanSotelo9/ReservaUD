package com.api.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.dto.response.UserResponse;
import com.api.backend.exception.UnauthorizedException;
import com.api.backend.model.User;
import com.api.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable("id") Long id, Authentication auth){
        User user = (User) auth.getPrincipal();
        if(!user.getKIdusuario().equals(id)){
            throw new UnauthorizedException("no autorizado");
        }
        return userService.getUser(id);
    }
}
