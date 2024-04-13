package com.laoli.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laoli.model.ResponseModel;
import org.springframework.http.MediaType;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class ResponseUtil {
    public static void write(ResponseModel rm, HttpServletResponse response) throws IOException {
        //构造响应头
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("utf-8");
        //跨域设置
        response.setHeader("Access-Control-Allow-Origin","*");
        //输出流
        PrintWriter out = response.getWriter();
        //输出
        out.write(new ObjectMapper().writeValueAsString(rm));
        //关闭流
        out.close();
    }
}
