package com.example.admin.servlet;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

/**
 * @author zzq
 * @date 2021/12/29 14:40
 */
@Slf4j
//@WebFilter(urlPatterns = {"/css/*","/images/*"})   //*是servlet的学法，**是spring家的写法
public class MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
         log.info("过滤器 Init()");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        log.info("过滤器 doFilter()  真正的过滤方法");
        //这是以前Filter的写法
        filterChain.doFilter(servletRequest,servletResponse);
    }

    @Override
    public void destroy() {
        log.info("过滤器 destroy()");
    }
}
