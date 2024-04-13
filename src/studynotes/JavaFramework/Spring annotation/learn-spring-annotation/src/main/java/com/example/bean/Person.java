package com.example.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@AllArgsConstructor
@NoArgsConstructor   //这个也得加上，不然默认就没有无参构造了，想beans.xml就会报错
public class Person {
    /**
     * @Value
     * 1.基本数值
     * 2.SpEL；#{}
     * 3.取配置文件 ${}
     */

    @Value("王五")
    private String name;
    @Value("#{20-1}")
    private int age;

    @Value("${nickname}")
    private String nickname;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
