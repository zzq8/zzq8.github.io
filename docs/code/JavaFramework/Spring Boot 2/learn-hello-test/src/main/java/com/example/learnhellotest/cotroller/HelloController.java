package com.example.learnhellotest.cotroller;

import com.zzq.hello.service.HelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zzq
 * @date 2022/1/3 11:29
 */
@RestController
public class HelloController {

    @Autowired
    HelloService helloService;

    @GetMapping("/hello")
    public String sayHello(){
        String s = helloService.sayHello("张三");
        return s;
    }
}
