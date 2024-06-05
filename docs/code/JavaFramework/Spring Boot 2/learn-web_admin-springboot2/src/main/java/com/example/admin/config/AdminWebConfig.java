package com.example.admin.config;

import com.example.admin.interceptor.LoginInterceptor;
import com.example.admin.interceptor.RedisUrlCountInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author zzq
 * @date 2021/12/28 21:04
 *
 * WebMvcConfigurer定制化SpringMVC的功能
 */
@Configuration
public class AdminWebConfig implements WebMvcConfigurer {

    /**
     * Filter、Interceptor 几乎拥有相同的功能？
     * 1、Filter是 Servlet 定义的原生的组件。好处：脱离 Spring 应用也能使用
     * 2、Interceptor是 Spring 定义的接口。可以使用 Spring 的自动装配等功能
     * @param registry
     */

    @Autowired
    RedisUrlCountInterceptor urlCountInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/","/login","/css/**","/fonts/**","/images/**","/js/**","/sql/**"); //放行的请求


        registry.addInterceptor(urlCountInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/","/login","/css/**","/fonts/**","/images/**","/js/**","/sql/**"); //放行的请求
    }
}
