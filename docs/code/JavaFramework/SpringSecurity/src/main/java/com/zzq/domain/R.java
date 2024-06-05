package com.zzq.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
/**
 * 序列化时过滤null属性：当对象被序列化为JSON字符串时，Jackson会默认包含所有属性，
 * 包括值为null的属性。通过在类上添加@JsonInclude(JsonInclude.Include.NON_NULL)注解，
 * 可以告诉Jackson只序列化非null值的属性，从而减少生成的JSON字符串的大小，并且可以排除掉那些没有值的属性。
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class R<T> {
    /**
     * 状态码
     */
    private Integer code;
    /**
     * 提示信息，如果有错误时，前端可以获取该字段进行提示
     */
    private String msg;
    /**
     * 查询到的结果数据，
     */
    private T data;

    public R(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public R(Integer code, T data) {
        this.code = code;
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public R(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}