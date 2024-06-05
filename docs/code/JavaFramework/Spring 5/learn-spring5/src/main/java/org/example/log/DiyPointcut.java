package org.example.log;

import org.springframework.stereotype.Component;

/**
 * 方法二
 */
@Component
public class DiyPointcut {

    public void before(){
        System.out.println("---------方法执行前---------");
    }
    public void after(){
        System.out.println("---------方法执行后---------");
    }
}
