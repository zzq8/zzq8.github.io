package com.zzq.vlt;

import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierDemo {

    public static void main(String[] args) {
        //定义一个循环屏障，参数1：需要累加的值（在触发障碍之前必须调用的线程数量），参数2 需要执行的方法
        CyclicBarrier barrier = new CyclicBarrier(7, () -> {
            System.out.println("召唤神龙");
        });

        for (int i = 0; i < 7; i++) {
            final Integer tempInt = i;
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "\t 收集到 第" + tempInt + "颗龙珠");
                try {
                    // 先到的被阻塞，等全部线程完成后，才能执行方法
                    // 我的理解：需要7个线程摸一下这个方法
                    barrier.await();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
}
