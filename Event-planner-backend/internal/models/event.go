package models
import "time"

type Event struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Time        time.Time `json:"time"`
	Date        time.Time `json:"date"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

