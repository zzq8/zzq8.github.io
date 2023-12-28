package com.zzq.controller;

import com.zzq.domain.R;
import com.zzq.domain.User;
import com.zzq.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/user/login")
    public R login(@RequestBody User user){
        return loginService.login(user);
    }

    @GetMapping("/user/logout")
    public R logout(){
        return loginService.logout();
    }
}
