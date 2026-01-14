package com.BackEnd_Tien.Controller.API;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.BackEnd_Tien.Entity.ProductDTO;
import com.BackEnd_Tien.Entity.Products;
import com.BackEnd_Tien.Service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*") 
public class ProductController {

    @Autowired
    private ProductService productService;

   //Thêm sản phẩm
    @PostMapping("")
    public Products addProduct(@RequestBody ProductDTO productDTO) {
        return productService.saveProduct(productDTO);
    }
    
    
    //Api cập nhật lại sản phẩm
    @PutMapping(value = "/{id}")
    public Products updateProduct(@PathVariable Long id,@RequestBody ProductDTO productDTO) {
    	return productService.updateProducts(id,productDTO);
    }
    
    
    // xoá sản phẩm 
    @DeleteMapping(value = "/{id}")
    public Products deleteProducts(@PathVariable Long id) {
    	return productService.deleteProducts(id);
    }
    
 // API lấy danh sách tất cả sản phẩm
    @GetMapping("")
    public List<Products> getAll() {
        return productService.getAllProducts();
    }
    //Tìm kiếm thông tin sản phẩm hoặc lọc theo category
     @GetMapping(value = "/search")
     public List<Products> searchProducts(@RequestParam(name = "keyword", required = false) String keyword) {
         if (keyword == null || keyword.trim().isEmpty()) {
             return productService.getAllProducts();
         }
         return productService.getGroupProducts(keyword);
     }
     
     //Phân loại sản phẩm theo category
     @GetMapping(value = "/category/{type}")
     public List<Products> getGroupProduct(@PathVariable("type") String type){
    	 return productService.getGroupProducts(type);
     }
     
//     //Cập nhật theo số lượng sản phẩm
//     @PutMapping(value = "/quantum/{num}")
//     public Products updateProducts 
     
     //Kiểm tra xem số lượng sản phẩm còn kho
     @PostMapping("/purchase/{id}")
     public Products purchaseProduct(@PathVariable Long id, 
                                     @RequestParam("quantity") int quantity) {
         return productService.purchaseProduct(id, quantity);
     }
}