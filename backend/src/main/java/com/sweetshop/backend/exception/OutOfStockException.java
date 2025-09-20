package com.sweetshop.backend.exception;

/**
 * Exception thrown when trying to purchase an out-of-stock sweet
 */
public class OutOfStockException extends RuntimeException {
    public OutOfStockException(String message) {
        super(message);
    }
}