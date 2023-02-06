package com.example.features.bean;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * @author zzq
 * @date 2022/1/2 21:53
 */

@Profile("dev")
@Component
@ConfigurationProperties("person")
@Data
public class Worker implements Person {

    String name;
}
