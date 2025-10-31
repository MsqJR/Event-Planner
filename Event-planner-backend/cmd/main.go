package main

import (
	"fmt"
	"log"
	"net/http"

	"eventplanner-backend/internal/config"
	"eventplanner-backend/internal/database"
	"eventplanner-backend/internal/handlers"
	"eventplanner-backend/internal/middleware"

	"github.com/gorilla/mux"
)

func main() {

	if err := config.LoadConfig(); err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer database.CloseDB()

	authHandler := handlers.NewAuthHandler(database.DB)

	router := mux.NewRouter()

	router.Use(middleware.CORS) 

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","message":"Event Planner API - Phase 0: Authentication"}`)
	}).Methods("GET")

	api := router.PathPrefix("/api/v1").Subrouter()

	api.HandleFunc("/auth/signup", authHandler.Signup).Methods("POST")
	api.HandleFunc("/auth/login", authHandler.Login).Methods("POST")
	api.HandleFunc("/auth/check", authHandler.CheckAuth).Methods("GET")

	router.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})

	addr := fmt.Sprintf("%s:%s", config.AppConfig.Host, config.AppConfig.Port)
	fmt.Printf("Event Planner Phase 0 Server starting on %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, router))
}

