package com.example.admin.servlet;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * @author zzq
 * @date 2021/12/29 14:47
 */

@Slf4j
//@WebListener
public class MyServletContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("监听器 contextInitialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("监听器 contextDestroyed");
    }
}
