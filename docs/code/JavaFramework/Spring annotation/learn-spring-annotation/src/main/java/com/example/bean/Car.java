package com.example.bean;

import lombok.Data;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

@Data
public class Car implements InitializingBean, DisposableBean {

    public Car(){
        System.out.println("car construction...");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("car init...");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("car destroy...");
    }

//    void init(){
//        System.out.println("car init...");
//    }
//
//    void destroy(){
//        System.out.println("car destroy...");
//    }
}
