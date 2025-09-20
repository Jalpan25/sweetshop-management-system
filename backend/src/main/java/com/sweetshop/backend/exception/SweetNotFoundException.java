package com.sweetshop.backend.exception;

/**
 * Exception thrown when a sweet is not found
 */
public class SweetNotFoundException extends RuntimeException {
    public SweetNotFoundException(String message) {
        super(message);
    }
}