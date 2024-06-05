package org.example.demo3;

import lombok.ToString;
import org.springframework.context.ApplicationEvent;

@ToString
public class Demo3Event extends ApplicationEvent {
    private String arg;
    public Demo3Event(String arg) {
        super(arg);
        this.arg = arg;
    }
}

