package com.example.features.bean;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * @author zzq
 * @date 2022/1/2 21:52
 */

@Profile(value = {"pro","default"})  //只有在这个环境下才生效 默认环境是default
@Component
/**
 * 如果配置文件没有就会报错，这个注解怎么给默认值？  网上没有给默认值的帖子，估计想给直接在默认yaml中给这也是解决办法把
 */
@ConfigurationProperties("person")
@Data
public class Boss implements Person {

    String name;
}
