package com.laoli.controller;

import com.laoli.model.ResponseModel;
import com.laoli.utils.JwtUtil;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
public class NewTokenController {
    @GetMapping("/newToken")
    public ResponseModel newToken(){
        String accessToken = JwtUtil.generateToken(1000*10);
        String refreshToken = JwtUtil.generateToken(1000*30);
        Map tokenMap = new HashMap();
        tokenMap.put("accessToken",accessToken);
        tokenMap.put("refreshToken",refreshToken);
        return new ResponseModel(200, "seccess", tokenMap);
    }
}
