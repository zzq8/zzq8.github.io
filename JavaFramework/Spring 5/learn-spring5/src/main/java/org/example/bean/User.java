package org.example.bean;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class User {

    @Autowired
    @Qualifier("cat")
    private Cat cat;

    @Autowired
    @Qualifier(value = "dog")
    private Dog dog;

    @Value("zzq")
    // 相当于配置文件中 <property name="name" value="zzq"/>
    private String str;
}
