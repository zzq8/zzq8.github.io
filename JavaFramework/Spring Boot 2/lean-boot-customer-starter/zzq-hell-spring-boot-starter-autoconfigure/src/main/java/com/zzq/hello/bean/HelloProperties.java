package com.zzq.hello.bean;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author zzq
 * @date 2022/1/3 11:38
 */
@ConfigurationProperties("zzq.hello")
public class HelloProperties {

    private String prefix;
    private String suffix;

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }
}
