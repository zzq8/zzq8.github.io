package org.example.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    //属性名和列名一样
    private Integer id;
    private String name;
    private String email;
    private Integer age;
    // set ,get , toString
}