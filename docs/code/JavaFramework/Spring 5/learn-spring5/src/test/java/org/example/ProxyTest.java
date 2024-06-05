package org.example;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * 核心:
 * 问题一：如何根据加载到内存中的被代理类，动态的创建一个代理类及其对象。
 * （通过Proxy.newProxyInstance()实现）
 * 问题二：当通过代理类的对象调用方法a时，如何动态的去调用被代理类中的同名方法a。
 * (通过InvocationHandler接口的实现类及其方法invoke())
 */
interface Human{
    String belief();
    void eat(String food);
}

class superman implements Human{

    @Override
    public String belief() {
        return "I believe i can fly!";
    }

    @Override
    public void eat(String food) {
        System.out.println("I like eat "+food);
    }
}


class proxyFactory{
    public static Object getProxyInstance(Object obj){
        Object o = Proxy.newProxyInstance(obj.getClass().getClassLoader(), obj.getClass().getInterfaces(), new MyInvocationHandler(obj));
        return o;
    }
}

class MyInvocationHandler implements InvocationHandler{

    private Object obj;

    MyInvocationHandler(Object obj){
        this.obj = obj;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object invoke = method.invoke(obj, args);
        return invoke;
    }
}

public class ProxyTest {

    public static void main(String[] args) {
        superman superman = new superman();
        Human proxyInstance = (Human) proxyFactory.getProxyInstance(superman);

        System.out.println(proxyInstance.belief());
        proxyInstance.eat("四川麻辣烫");


        /**
         * 下面还可以写其他的被代理类，例如租房、鞋子工厂
         * 都只需被代理类和其接口，代理类是动态生成的
         */
    }
}


