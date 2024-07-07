package org.example.demo4;

/**
 * Demo4::::::::
 * @EventListener' 用法讲解
 * 1.监听自定义事件  demo3、2 已说
 * 2.注解中指定监听事件类型,可指定多个监听事件类型
 * 3.注解中使用condition根据特定条件进行监听
 * 4.根据特定条件进行监听对事件进行修改后返回
 *
 *----------------------------------------------------------------
 *Demo5::::::::
 * 一般搭配以下两个注解一起使用：  **@EventListener @Async**
 * 1. @0rder指定执行顺序在同步的情况下生效
 * 2. @Async 异步执行需要 @EnableAsync 开启异步
 *
 * ----------------------------------------------------------------
 * Demo6::::::::
 * ApplicationEvent 可以不实现，看顶层的这个接口源码其实也转成了 Object，
 * 但是按规范注释来说希望所有的事件类都最好实现 ApplicationEvent
 */
public class Demo4App {
}