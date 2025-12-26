# Stage 1: Build stage
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Stage 2: Runtime stage (minimal image)
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Use non-root working directory
WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy migrations
COPY --from=builder /app/migrations ./migrations

# Set executable permissions for non-root users
RUN chmod +x /app/main

# Use non-root user (OpenShift will override with its own UID)
USER 1001

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"]
