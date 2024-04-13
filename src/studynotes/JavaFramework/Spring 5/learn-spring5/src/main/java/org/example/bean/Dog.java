package org.example.bean;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
public class Dog {
    public void shout() {
        System.out.println("wang~");
    }
}
