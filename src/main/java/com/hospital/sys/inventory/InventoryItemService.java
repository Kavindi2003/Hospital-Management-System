package com.hospital.sys.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryItemService {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    // Get all inventory items
    public List<InventoryItem> getAllItems() {
        return inventoryItemRepository.findAll();
    }

    // Get one inventory item by ID
    public Optional<InventoryItem> getItemById(Integer id) {
        return inventoryItemRepository.findById(id);
    }

    // Add a new inventory item
    public InventoryItem saveItem(InventoryItem item) {
        return inventoryItemRepository.save(item);
    }

    // Update an existing inventory item
    public InventoryItem updateItem(Integer id, InventoryItem updatedItem) {

        InventoryItem existingItem = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setCategory(updatedItem.getCategory());
        existingItem.setQuantityInStock(updatedItem.getQuantityInStock());
        existingItem.setUnitPrice(updatedItem.getUnitPrice());
        existingItem.setBatchNumber(updatedItem.getBatchNumber());
        existingItem.setExpirationDate(updatedItem.getExpirationDate());

        return inventoryItemRepository.save(existingItem);
    }

    // Delete an inventory item
    public void deleteItem(Integer id) {
        inventoryItemRepository.deleteById(id);
    }
}