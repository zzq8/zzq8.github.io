package com.example.boot.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author zzq
 * @date 2021/12/26 9:35
 */
//@Component  //容器中的组件才能有SpringBoot提供的强大的功能,不写这个注释下面这个注释就不会生效,但可以用EnableConfigurationProperties
@ConfigurationProperties(prefix = "mycar")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    private String brand;
    private String price;
}
