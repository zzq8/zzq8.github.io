package com.laoli.controller;

import com.laoli.entity.User;
import com.laoli.model.ResponseModel;
import com.laoli.utils.JwtUtil;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin   //idea 打开的静态页面idea会给他一个端口协议是http://localhost:63342/，explorer直接打开就不会协议就是file:///
public class LoginController {
    @PostMapping("/login")
    public ResponseModel login(@RequestBody User user) {
        Integer code = 200;
        String msg = "success";
        String accessToken = null;
        String refreshToken = null;
        Map tokenMap = new HashMap();
        if (user.getUsername().equals("admin") && user.getPassword().equals("123")) {
            //生成jwt
            accessToken = JwtUtil.generateToken(1000 * 10);  //10秒
            refreshToken = JwtUtil.generateToken(1000 * 30);  //30秒
            tokenMap.put("accessToken",accessToken);
            tokenMap.put("refreshToken",refreshToken);
        } else {
            code = 500;
            msg = "failure";
        }
        return new ResponseModel(code, msg, tokenMap);
    }
}
