package com.BackEnd_Tien.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.BackEnd_Tien.Entity.Products;

@Repository
public interface ProductRepository extends JpaRepository<Products, Long> {
	// Tìm kiếm sản phẩm nếu Tên HOẶC Loại HOẶC Mô tả chứa từ khóa (keyword)
    @Query("SELECT p FROM Products p WHERE p.name LIKE %:keyword% OR p.category LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Products> searchByKeyword(@Param("keyword") String keyword);
 // Tìm chính xác theo loại (hoặc chứa từ khóa trong loại)
    List<Products> findByCategoryContaining(String category);
    
}