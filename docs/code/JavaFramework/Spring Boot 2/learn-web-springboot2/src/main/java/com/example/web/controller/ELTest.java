package com.example.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ELTest {

    @Value("${person.name}")
    private String name;

    @GetMapping("el")
    public String el(){
        return name;
    }
}
