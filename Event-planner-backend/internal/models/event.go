package models

import "time"

type Event struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Date        string    `json:"date"`
	Time        string    `json:"time"`
	Location    string    `json:"location"`
	Description string    `json:"description"`
	OrganizerID int       `json:"organizer_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateEventRequest struct {
	Name        string `json:"name"`
	Date        string `json:"date"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

type UpdateEventRequest struct {
	Name        string `json:"name"`
	Date        string `json:"date"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Description string `json:"description"`
}
