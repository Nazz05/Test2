package com.BackEnd_Tien.Entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
	@Entity
	@Table(name = "products")
	@Data // Tự động tạo getter/setter từ Lombok
	public class Products {
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String name;
	    private Integer quantum;
	    private String description;
	    private Double price;
	    private String imageUrl;
	    private String category;

}
