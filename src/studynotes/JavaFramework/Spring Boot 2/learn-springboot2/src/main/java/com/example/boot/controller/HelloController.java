package com.example.boot.controller;

import com.example.boot.bean.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zzq
 * @date 2021/12/24 17:05
 *
 * @RestController = @Controller + @ResponseBody
 */
@RestController
public class HelloController {
    @Autowired
    Vehicle vehicle;

    @RequestMapping("hello2")
    public String hello(){
        return "hello springBoot 2 !!!";
    }

    @RequestMapping("vehicle")
    public Vehicle getVehicle(){
        return vehicle;
    }
}
