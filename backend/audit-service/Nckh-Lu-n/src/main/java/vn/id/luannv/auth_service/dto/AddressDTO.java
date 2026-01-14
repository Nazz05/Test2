package vn.id.luannv.auth_service.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private Long id;
    private String recipientName;
    private String phone;
    private String addressLine;
    private String ward;
    private String district;
    private String province;
    private String postalCode;
    private Boolean isDefault;
    private String notes;
}
