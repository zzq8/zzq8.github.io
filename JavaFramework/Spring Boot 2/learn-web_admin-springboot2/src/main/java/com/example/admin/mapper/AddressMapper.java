package com.example.admin.mapper;

import com.example.admin.bean.Address;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author zzq
 * @date 2021/12/30 17:30
 */
@Mapper
public interface AddressMapper {

    public Address getAddressById(Integer id);
}
