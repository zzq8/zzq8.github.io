package com.example.web;

import org.junit.jupiter.api.Test;

//@SpringBootTest
class LearnWebSpringboot2ApplicationTests {

    @Test
    void contextLoads() {
        System.out.println("value="+switchit(4));//3
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
