package com.BackEnd_Tien.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BackEnd_Tien.Entity.ProductDTO;
import com.BackEnd_Tien.Entity.Products;
import com.BackEnd_Tien.Repository.ProductRepository;

import jakarta.transaction.Transactional;
 @Service
 public class ProductService {
	@Autowired
    private ProductRepository productRepository;

    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }

   
    //Them sản phẩm 
    public Products saveProduct(ProductDTO productDTO) {	
    	Products newProduct = new Products();
    	newProduct.setName(productDTO.getName());
    	newProduct.setCategory(productDTO.getCategory());
    	newProduct.setDescription(productDTO.getDescription());
    	newProduct.setImageUrl(productDTO.getImageUrl());
    	newProduct.setPrice(productDTO.getPrice());
    	
    	return productRepository.save(newProduct);
    }
    
//    public List<Products> getGroupProducts(String typeOfProduct) {
//       
//        return productRepository.searchByKeyword(typeOfProduct);
//    }
    /// CẬP NHẬT SẢN PHẨM
    public Products updateProducts(Long id, ProductDTO productDTO) {
		Products exProduct = productRepository.getReferenceById(id);
    	if(exProduct == null)new RuntimeException("Khong co san pham nay;");
    	exProduct.setName(productDTO.getName());
    	exProduct.setPrice(productDTO.getPrice());
    	exProduct.setDescription(productDTO.getDescription());
    	exProduct.setCategory(productDTO.getCategory());		
    	exProduct.setImageUrl(productDTO.getImageUrl());
    	return productRepository.save(exProduct);
    }
    //Tìm kiếm theo sản phẩm
    public List<Products> getGroupProducts(String typeOfProduct) {
        // Chỉ tìm trong cột Category, không tìm trong Description nữa
        return productRepository.findByCategoryContaining(typeOfProduct);
    }
	public Products deleteProducts(Long id) {
		// TODO Auto-generated method stub
		if (!productRepository.existsById(id)) {
	        throw new RuntimeException("Không tìm thấy sản phẩm để xóa!");
	    }
	    productRepository.deleteById(id);
		
		return null;
	}
	
	@Transactional
	public Products purchaseProduct(Long id, int quantityToBuy) {
		//tìm sản phẩm
	    Products product = productRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID: " + id));

	    // Lấy số lượng hiện tại, nếu null thì gán bằng 0
	    Integer currentQuantum = product.getQuantum();
	    if (currentQuantum == null) {
	        currentQuantum = 0;
	    }

	    // Kiểm tra đủ hàng không
	    if (currentQuantum < quantityToBuy) {
	        throw new RuntimeException("Sản phẩm này chỉ còn " + currentQuantum + " cái (hoặc chưa nhập số lượng), không đủ để bán!");
	    }

	    // Trừ kho
	    int newQuantum = currentQuantum - quantityToBuy;
	    product.setQuantum(newQuantum);

	    return productRepository.save(product);
	}
}
