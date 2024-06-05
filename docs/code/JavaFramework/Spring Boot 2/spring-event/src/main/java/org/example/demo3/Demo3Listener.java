package org.example.demo3;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class Demo3Listener {
    @EventListener
    public void onApplicationEvent(Demo3Event event) {
        log.info("[Demo3Listener onApplicationEvent]: {}", event);
    }

    @EventListener
    public void onApplicationEvent2(ApplicationEvent event) {
        log.info("[ApplicationEvent]: {}", event);
    }
}
