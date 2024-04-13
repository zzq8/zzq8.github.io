package com.example.admin.controller;

import com.example.admin.bean.Address;
import com.example.admin.bean.User;
import com.example.admin.mapper.AddressMapper;
import com.example.admin.service.UserService;
import com.example.admin.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zzq
 * @date 2021/12/30 15:05
 */
@RestController
public class SqlController {
    @Autowired
    UserService userService;

    @Autowired
    AddressMapper addressMapper;









    @GetMapping("/address")
    public Address getAddress(){
        Address address = addressMapper.getAddressById(1);
        return address;
    }

    @GetMapping("/select")
    public User getUser(){
        User userById = userService.getUserById(2L);
        return userById;
    }

    @PostMapping("/insert")
    public User insert(User user){
        userService.insert(user);

        return user;
    }
}
