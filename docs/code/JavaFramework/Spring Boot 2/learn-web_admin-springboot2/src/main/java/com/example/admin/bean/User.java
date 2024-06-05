package com.example.admin.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.math.BigInteger;

/**
 * @author zzq
 * @date 2021/12/28 20:40
 */
@Alias("user")
@Data
@AllArgsConstructor
public class User {
    private Integer id;
    private String name;
    private Integer age;
    private String email;
}
