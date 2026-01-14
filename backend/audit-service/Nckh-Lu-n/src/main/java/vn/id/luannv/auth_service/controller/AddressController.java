package vn.id.luannv.auth_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.id.luannv.auth_service.dto.AddressDTO;
import vn.id.luannv.auth_service.service.AddressService;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','USER')")
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@PathVariable Long userId) {
        List<AddressDTO> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressDTO> createAddress(
            @PathVariable Long userId,
            @RequestBody AddressDTO addressDTO) {
        AddressDTO created = addressService.createAddress(userId, addressDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{addressId}/user/{userId}")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody AddressDTO addressDTO) {
        AddressDTO updated = addressService.updateAddress(userId, addressId, addressDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{addressId}/user/{userId}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.ok("Address deleted successfully");
    }
}
