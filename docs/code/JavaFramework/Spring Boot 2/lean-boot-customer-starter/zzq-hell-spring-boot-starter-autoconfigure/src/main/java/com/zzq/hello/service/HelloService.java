package com.zzq.hello.service;

import com.zzq.hello.bean.HelloProperties;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author zzq
 * @date 2022/1/3 11:08
 *
 * 默认不要放到容器中
 */
public class HelloService {

    @Autowired
    HelloProperties helloProperties;

    public String sayHello(String userName){
        return helloProperties.getPrefix() + ": "+userName+">"+ helloProperties.getSuffix();
    }
}
