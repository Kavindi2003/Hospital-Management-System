package com.hospital.sys.inventory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    public InventoryItemController(
            InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    // Read all inventory items
    @GetMapping
    public List<InventoryItem> getAllItems() {
        return inventoryItemService.getAllItems();
    }

    // Read one inventory item by ID
    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(
            @PathVariable Integer id) {

        return inventoryItemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new inventory item
    @PostMapping
    public ResponseEntity<InventoryItem> createItem(
            @RequestBody InventoryItem item) {

        item.setItemId(null);

        InventoryItem savedItem =
                inventoryItemService.saveItem(item);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedItem);
    }

    // Update an existing inventory item
    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateItem(
            @PathVariable Integer id,
            @RequestBody InventoryItem updatedItem) {

        try {
            InventoryItem savedItem =
                    inventoryItemService.updateItem(id, updatedItem);

            return ResponseEntity.ok(savedItem);
        } catch (RuntimeException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an inventory item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Integer id) {

        if (inventoryItemService.getItemById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        inventoryItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}