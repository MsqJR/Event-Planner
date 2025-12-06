package middleware

import (
	"log"
	"net/http"
)

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow both development and Docker origins
		allowedOrigins := map[string]bool{
			"http://localhost:5173": true, // Vite dev server
			"http://localhost":      true, // Docker/Nginx
		}

		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			// Default to localhost for backwards compatibility
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost")
		}

		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests explicitly
		if r.Method == http.MethodOptions {
			log.Printf("Preflight handled for %s", r.URL.Path)
			w.WriteHeader(http.StatusNoContent) // 204 No Content
			return
		}

		next.ServeHTTP(w, r)
	})
}
