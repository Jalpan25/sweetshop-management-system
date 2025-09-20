package com.sweetshop.backend.exception;

/**
 * Exception thrown when an invalid quantity is provided
 */
public class InvalidQuantityException extends RuntimeException {
    public InvalidQuantityException(String message) {
        super(message);
    }
}