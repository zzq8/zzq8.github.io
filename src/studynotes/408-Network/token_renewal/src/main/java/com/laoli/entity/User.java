package com.laoli.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {
    /**
     * 用户id
     */
    private Integer userId;
    /**
     * 用户名字
     */
    private String username;
    /**
     * 用户密码
     */
    private String password;
}
