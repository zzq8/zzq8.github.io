package com.zzq.vlt;

/**
 * 假设是主物理内存
 */
class MyDataC {
    volatile int n = 0;

    public void add() {
        n++;
    }
}