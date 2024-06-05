package com.zzq.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author 35238
 * @date 2023/7/11 0011 20:59
 */
@Data //get和set方法
@NoArgsConstructor //无参构造
@AllArgsConstructor
@Builder  //带参构造
//实现UserDetails接口之后，要重写UserDetails接口里面的7个方法
public class LoginUser implements UserDetails {

    private User xxuser;

    private List<String> xxpermissions;

    private transient List<SimpleGrantedAuthority> authorities;

    @Override
    //用于返回权限信息。现在我们正在学'认证'，'权限'后面才学。所以返回null即可
    public Collection<? extends GrantedAuthority> getAuthorities() {

        if(authorities != null){ //严谨来说这个if判断是避免整个调用链中security本地线程变量在获取用户时的重复解析，和redis存取无关
            return authorities;
        }
        //为空的话就会执行下面的转换代码
        //List<SimpleGrantedAuthority> authorities = xxpermissions //简化这行如下一行，我们把authorities成员变量写到外面了
        authorities = xxpermissions
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        //最终返回转换结果
        return authorities;
    }

    @Override
    //用于获取用户密码。由于使用的实体类是User，所以获取的是数据库的用户密码
    public String getPassword() {
        return xxuser.getPassword();
    }

    @Override
    //用于获取用户名。由于使用的实体类是User，所以获取的是数据库的用户名
    public String getUsername() {
        return xxuser.getUserName();
    }

    @Override
    //判断登录状态是否过期。把这个改成true，表示永不过期
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    //判断账号是否被锁定。把这个改成true，表示未锁定，不然登录的时候，不让你登录
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    //判断登录凭证是否过期。把这个改成true，表示永不过期
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    //判断用户是否可用。把这个改成true，表示可用状态
    public boolean isEnabled() {
        return true;
    }
}