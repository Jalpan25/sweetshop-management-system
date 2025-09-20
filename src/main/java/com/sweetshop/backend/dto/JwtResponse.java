package com.sweetshop.backend.dto;

public class JwtResponse {
    private String token;
    private Long id;
    private String email;
    private String name;
    private String role;

    public JwtResponse(String token, Long id, String email, String name, String role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
}
