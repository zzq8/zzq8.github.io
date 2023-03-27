package com.example.web;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

//@SpringBootTest
class LearnWebSpringboot2ApplicationTests {

    /**
     * 数组 desc 排序
     */
    @Test
    public void test01(){
        int[] arr = { 3, 2, 1, 5, 4 };

        int count = Arrays.stream(arr).sum();

        Integer[] integers = Arrays.stream(arr).boxed().toArray(Integer[]::new);
        List<Integer> collect = Arrays.stream(arr).boxed().collect(Collectors.toList());


        Arrays.sort(integers,((o1, o2) -> o2-o1));
        System.out.println(Arrays.toString(integers));

    }
    
    
    
    

    @Test
    void contextLoads() {
        System.out.println("value="+switchit(4));//3
    }


    //单元测试类中，初始化方法    alt+insert SetUpMethod
    //视频中是测 Jedis 用这个方法连 Redis
    @BeforeEach
    void setUp() {

    }

    public static int switchit(int x) {
        int j=1;
        switch (x) {
            case 1:j++;
            case 2:j++;
            case 3:j++;
            case 4:j++;
            case 5:j++;
            default:j++;
        }
        return j+x;
    }

}
