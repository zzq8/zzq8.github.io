package com.zzq;

import com.zzq.domain.User;
import com.zzq.mapper.MenuMapper;
import com.zzq.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@SpringBootTest
class SpringSecurityApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private MenuMapper menuMapper;

    @Test
    public void testSelectPermsByUserId(){
        //L表示Long类型
        List<String> list = menuMapper.selectPermsByUserId(2L);
        System.out.println(list);
    }

    @Test
    public void testUserMapper(){
        //查询所有用户
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }

    @Test
    public void testPassword(){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encode = encoder.encode("123");
        System.out.println(encode);

        System.out.println(encoder.matches("123", "$2a$10$lcenSP3nAVbtP7Zm2XuN4eAQMdGMb2frxXUerqUjEakB57bRDl24y"));
    }


}
