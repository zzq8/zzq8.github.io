package com.zzq.vlt;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 这段代码验证，不可见性
 * 需要加 volatile 来保证可见性，学习一下JMM的三个特征
 * volatile：
 * 保证可见性
 * 不保证原子性
 * 保证指令重排：单线程环境不用关心指令重排！
 */
class DataDemo {
    volatile int number = 0;
    AtomicInteger number2 = new AtomicInteger();

    void changeNumber(){
        this.number = 60;
    }

    //synchronized
    void addPlusPlus(){
        number ++;
    }

    void addPlusPlus2(){
        number2.getAndIncrement();
    }
}

public class VolatileTest {

    public static void main(String[] args) {

        /**
         * 不保证原子性，可能有人加塞 出现写覆盖
         * n ++ class后是3个指令组成 1.拿到这个值 2.加一 3.写到主内存
         */
        DataDemo demo = new DataDemo();
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    demo.addPlusPlus();
                    demo.addPlusPlus2();
                }
            },String.valueOf(i)).start();
        }

        // 关键
        while(Thread.activeCount() > 2){
            Thread.yield();
        }

        System.out.println(Thread.currentThread().getName()+"\t volatile："+demo.number);
        System.out.println(Thread.currentThread().getName()+"\t Atomic："+demo.number2);
    }

    /**
     * 保证可见性
     */
    private static void seeOkByVolatile() {
        DataDemo demo = new DataDemo();

        new Thread(() -> {
            System.out.println(Thread.currentThread().getName()+"\t"+demo.number);
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            demo.changeNumber();
            System.out.println(Thread.currentThread().getName()+"\t update："+demo.number);
        },"AAA").start();

        while(demo.number == 0){

        }

        System.out.println(Thread.currentThread().getName()+"\t mission success："+demo.number);
    }
}

