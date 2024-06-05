package com.example.admin.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.ibatis.type.Alias;

/**
 * @author zzq
 * @date 2021/12/30 17:31
 */

@Alias("address")
@Data
@AllArgsConstructor
public class Address {

    int id;
    String address;
}
