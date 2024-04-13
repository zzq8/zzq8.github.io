package com.example.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;

import java.util.Arrays;

@Aspect
public class LogAspects {

    @Pointcut("execution(public int com.example.aop.MathCalculator.*(..))")
    public void pointCut(){}

    @Before("pointCut()")
    public void logStart(JoinPoint joinPoint) {
        System.out.println("除法运行......@Before，参数列表是：{"+ Arrays.asList(joinPoint.getArgs())+"}");
    }

    // 在目标方法（即div方法）结束时被调用
    // @After("pointCut()")
    @After("com.example.aop.LogAspects.pointCut()")
    public void logEnd() {
        System.out.println("除法结束......@After");
    }

    // 在目标方法（即div方法）正常返回了，有返回值，被调用
    @AfterReturning(value = "pointCut()", returning = "res")
    public void logReturn(Object res) {
        System.out.println("除法正常返回......@AfterReturning，运行结果是：{"+res+"}");
    }

    // 在目标方法（即div方法）出现异常，被调用
    @AfterThrowing(value = "pointCut()", throwing = "e")
    public void logException(Exception e) {
        System.out.println("除法出现异常......异常信息：{"+e+"}");
    }
}
