package com.example.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.admin.bean.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * @author zzq
 * @date 2021/12/30 14:21
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("select * from user where id = #{id}")
    public User getById(Long id);

//    @Insert("insert user(`name`,`age`,`email`) values(#{name},#{age},#{email})")
    public void addUser(User user);
}
