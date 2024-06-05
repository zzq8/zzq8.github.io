package com.example.admin.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Arrays;

/**
 * @author zzq
 * @date 2021/12/29 21:37
 *
 * 可以直接pom引入 start 就不用写这个配置类了
 */
//@Configuration
public class MyDataSourceConfig {

    /**
     * 需要学习一下druid数据库！！！！！！！！！！！！！
     * @return
     */
    @ConfigurationProperties("spring.datasource")
    @Bean
    public DataSource dataSource() throws SQLException {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setFilters("stat,wall");
        return druidDataSource;
    }

    @Bean
    public ServletRegistrationBean statViewServlet(){
        StatViewServlet statViewServlet = new StatViewServlet();
        ServletRegistrationBean<StatViewServlet> bean = new ServletRegistrationBean<>(statViewServlet, "/druid/*");
        bean.addInitParameter("loginUsername","1");
        bean.addInitParameter("loginPassword","1");
        return bean;
    }

    /**
     * WebStatFilter用于采集web-jdbc关联监控的数据。
     */
    @Bean
    public FilterRegistrationBean druidWebStatFilter(){
        WebStatFilter webStatFilter = new WebStatFilter();
        FilterRegistrationBean<WebStatFilter> bean = new FilterRegistrationBean<>(webStatFilter);
        bean.setUrlPatterns(Arrays.asList("/*"));
        bean.addInitParameter("exclusions","*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");

        return bean;
    }
}
