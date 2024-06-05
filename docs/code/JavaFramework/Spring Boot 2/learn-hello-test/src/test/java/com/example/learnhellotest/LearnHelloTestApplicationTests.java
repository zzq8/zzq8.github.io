package com.example.learnhellotest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LearnHelloTestApplicationTests {

    @Test
    void contextLoads() {
        String s = "abc";
        String[] str = new String[]{s};
    }

}
