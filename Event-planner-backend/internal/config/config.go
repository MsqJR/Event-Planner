package config

import (
	"fmt"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	Port       string
	Host       string
}

var AppConfig *Config

func LoadConfig() error {
	// Try to load .env file, but don't fail if it doesn't exist
	// In production/containers, environment variables are set externally
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found, using environment variables or defaults")
	}

	AppConfig = &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "eventplanner"),
		Port:       getEnv("PORT", "8080"),
		Host:       getEnv("HOST", "0.0.0.0"),
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
