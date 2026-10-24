package com.agrismart.crop;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "crops")
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String variety;

    @Positive
    private double area;

    @NotBlank
    private String stage;

    private String water = "Not logged";
    private String health = "Healthy";

    public Crop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }
    public double getArea() { return area; }
    public void setArea(double area) { this.area = area; }
    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public String getWater() { return water; }
    public void setWater(String water) { this.water = water; }
    public String getHealth() { return health; }
    public void setHealth(String health) { this.health = health; }
}
