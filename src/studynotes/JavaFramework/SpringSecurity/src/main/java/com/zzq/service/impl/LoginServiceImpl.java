package com.zzq.service.impl;

import com.zzq.domain.LoginUser;
import com.zzq.domain.R;
import com.zzq.domain.User;
import com.zzq.service.LoginService;
import com.zzq.utils.JwtUtil;
import com.zzq.utils.RedisCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    //先在SecurityConfig，使用@Bean注解重写官方的authenticationManagerBean类，然后这里才能注入成功
    private AuthenticationManager authenticationManager;

    @Autowired
    //RedisCache是我们在utils目录写好的类
    private RedisCache redisCache;

    @Override
    public R login(User user) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getUserName(),user.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);

        if(Objects.isNull(authenticate)){
            throw new RuntimeException("登录失败");
        }

        //如果认证通过，就使用userid生成一个jwt，然后把jwt存入ResponseResult后返回
        LoginUser loginUser = (LoginUser) authenticate.getPrincipal();
        String userid = loginUser.getXxuser().getId().toString();
        String jwt = JwtUtil.createJWT(userid);

        //把完整的用户信息存入redis，其中userid作为key，注意存入redis的时候加了前缀 login:
        Map<String, String> map = new HashMap<>();
        map.put("token",jwt);
        redisCache.setCacheObject("login:"+userid,loginUser);
        return new R(200,"登录成功",map);
    }

    @Override
    public R logout() {
        //拿 Token 找 ID
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Long id = (Long) authentication.getPrincipal();

        //删 Redis
        redisCache.deleteObject("login:"+id);

        return new R(200,"注销成功");
    }
}
