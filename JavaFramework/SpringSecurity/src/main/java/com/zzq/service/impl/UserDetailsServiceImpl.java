package com.zzq.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.zzq.domain.LoginUser;
import com.zzq.domain.User;
import com.zzq.mapper.MenuMapper;
import com.zzq.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    //MenuMapper是我们在mapper目录写好的接口，作用是查询来自数据库的权限信息
    private MenuMapper menuMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName,username);

        User user = userMapper.selectOne(wrapper);
        if (Objects.isNull(user)) {
            throw new RuntimeException("用户名密码错误！");
        }

        //TODO 根据用户查询权限信息 添加到Loginuser中
        //由于我们自定义了3个权限，所以用List集合存储。注意权限实际就是'有特殊含义的字符串'，所以下面的三个字符串就是自定义的
        //下面那行就是我们的权限集合，等下还要在LoginUser类做权限集合的转换
//        List<String> list = new ArrayList<>(Arrays.asList("test","adminAuth","huanfAuth"));

        //-------------------------------查询来自数据库的权限信息--------------------------------

        List<String> list = menuMapper.selectPermsByUserId(user.getId());

        return LoginUser.builder().xxuser(user).xxpermissions(list).build();
    }
}
