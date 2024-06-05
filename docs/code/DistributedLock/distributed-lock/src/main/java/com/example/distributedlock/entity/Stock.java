package com.example.distributedlock.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * <p>
 * 
 * </p>
 *
 * @author XD
 * @since 2022-09-02
 */
@TableName("db_stock")
public class Stock implements Serializable {

    private static final long serialVersionUID = 1L;

    @Getter
    @Setter
    @TableField(exist = false)
    private int stock = 5000;

    private Long id;

    private String productCode;

    private String warehouse;

    private Integer count;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }
    public String getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(String warehouse) {
        this.warehouse = warehouse;
    }
    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "Stock{" +
            "id=" + id +
            ", productCode=" + productCode +
            ", warehouse=" + warehouse +
            ", count=" + count +
        "}";
    }
}
