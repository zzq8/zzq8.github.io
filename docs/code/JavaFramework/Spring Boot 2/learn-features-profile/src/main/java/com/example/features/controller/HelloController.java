package com.example.features.controller;

import com.example.features.bean.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zzq
 * @date 2022/1/2 21:00
 */
@RestController
public class HelloController {
    /**
     * A: 这里${user.name} 和 ${username} return出来的是 hasee
     */

//    @Value("${person.name:张三}")  //作用是绑定配置文件person.name的值，如果没有这个值，默认值是张三
//    String name;

    @Autowired
    Person person;

    @Value("${user.name}")  //可以获取系统的环境变量 environment variables
    String msg;

    @GetMapping("msg")
    public String msg(){
        return msg;
    }


    @GetMapping("/")
    public String hello(){
        return "Hello "+person;
    }
}
