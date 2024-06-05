package com.example.learn2.controller;

import com.example.learn2.bean.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zzq
 * @date 2021/12/27 14:53
 */
@RestController
public class HelloController {

    @Autowired
    private Person person;

    @RequestMapping("/person")
    public Person getPerson() {
        return person;
    }
}
