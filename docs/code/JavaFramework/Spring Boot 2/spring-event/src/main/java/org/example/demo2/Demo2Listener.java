package org.example.demo2;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class Demo2Listener implements ApplicationListener<Demo2Event> {
    @Override
    public void onApplicationEvent(Demo2Event event) {
        log.info("[onApplicationEvent]:{}",event.toString());
    }
}
