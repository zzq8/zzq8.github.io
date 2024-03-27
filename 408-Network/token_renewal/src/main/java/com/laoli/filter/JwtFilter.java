package com.laoli.filter;

import com.laoli.model.ResponseModel;
import com.laoli.utils.JwtUtil;
import com.laoli.utils.ResponseUtil;
import io.jsonwebtoken.lang.Strings;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(urlPatterns = "/*")
public class JwtFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        //得到2个对象
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;
        //直接放行：预检、登录     XD Study!!!
        if(HttpMethod.OPTIONS.toString().equals(request.getMethod())){
            filterChain.doFilter(request,response);
            return;
        }
        String requestURI = request.getRequestURI(); //不含主机和端口号：http://localhost:8080/login
        if(requestURI.contains("/login")){
            filterChain.doFilter(request,response);
            return;
        }
        //得到请求头的信息(accessToken)
        String token = request.getHeader("accessToken");
        if(!Strings.hasText(token)){
            //响应前端错误消息提示
            ResponseModel rm = new ResponseModel(500,"failure","令牌缺失");
            ResponseUtil.write(rm,response);
            return;
        }
        //解析token
        try {
            JwtUtil.parseToken(token);
        } catch (Exception e) {
            //响应前端错误消息提示
            ResponseModel rm = new ResponseModel(401,"failure","令牌过期");
            ResponseUtil.write(rm,response);
            return;
        }

        filterChain.doFilter(request,response);
    }
}
