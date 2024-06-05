package com.example.bean;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

public class Dog {

    public Dog(){
        System.out.println("Dog construct");
    }

    @PostConstruct
    void init(){
        System.out.println("Dog init...");
    }

    @PreDestroy
    void destroy(){
        System.out.println("Dog destroy...");
    }
}
