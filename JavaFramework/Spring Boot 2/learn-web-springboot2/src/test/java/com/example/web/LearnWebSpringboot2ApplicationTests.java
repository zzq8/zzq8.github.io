package com.example.web;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

//@SpringBootTest
class LearnWebSpringboot2ApplicationTests {

    @Test
    void contextLoads() {
        System.out.println("value="+switchit(4));//3
    }


    //单元测试类中，初始化方法    alt+insert SetUpMethod
    //视频中是测 Jedis 用这个方法连 Redis
    @BeforeEach
    void setUp() {

    }

    public static int switchit(int x) {
        int j=1;
        switch (x) {
            case 1:j++;
            case 2:j++;
            case 3:j++;
            case 4:j++;
            case 5:j++;
            default:j++;
        }
        return j+x;
    }

}
