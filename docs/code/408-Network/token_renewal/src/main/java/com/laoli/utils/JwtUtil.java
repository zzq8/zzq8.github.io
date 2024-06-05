package com.laoli.utils;

import io.jsonwebtoken.*;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

public class JwtUtil {
    /**jwt密钥*/
    private static String secret = "lianchengll";
    /**生成token(无业务数据)*/
    public static String generateToken(long expire) {
        //创建jwt构造器
        JwtBuilder builder = Jwts.builder();
        //生成jwt字符串
        return builder
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")
                .setId(UUID.randomUUID().toString())
                .setIssuer("laoli")
                .setIssuedAt(new Date())
                .setSubject("jwtdemo")
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    /**生成token(有业务数据)*/
    public static String generateToken(long expire, Map map) {
        //创建jwt构造器
        JwtBuilder builder = Jwts.builder();
        //生成jwt字符串
        return builder
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")
                .setClaims(map)
                .setId(UUID.randomUUID().toString())
                .setIssuer("laoli")
                .setIssuedAt(new Date())
                .setSubject("jwtdemo")
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    /**解析token*/
    public static Claims parseToken(String jwt) {
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(secret).parseClaimsJws(jwt);
        Claims payLoad = claimsJws.getBody();
        return payLoad;
    }
}
