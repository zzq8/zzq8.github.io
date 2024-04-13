package com.example.learnhellotest;

import java.lang.reflect.Proxy;

/**
 * @author zzq
 * @date 2022/1/9 22:19
 */
public class ProxyTest {
}

interface human {
    void belief();

    void eat(String food);
}

class superman implements human {

    @Override
    public void belief() {
        System.out.println("I believe i can fly!");
    }

    @Override
    public void eat(String food) {
        System.out.println("I like eat " + food);
    }
}

class proxyFactory{
//    public static Object getProxyInstance(Object obj){
//
//        Proxy.newProxyInstance(obj.getClass().getClassLoader(),obj.getClass().getInterfaces(),)
//    }
}
