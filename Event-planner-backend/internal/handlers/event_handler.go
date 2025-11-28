package handlers

import (
	"database/sql"
	"encoding/json"
	"eventplanner-backend/internal/models"
	"fmt"
	"io"
	"net/http"
	"strconv"
)

//handle Event operations
type EventHandler struct { DB *sql.DB }
func NewEventHandler(db *sql.DB) *EventHandler { return &EventHandler{DB: db} }


//Returns A list of events organized by User via the passed UserID
func (h *EventHandler) GetOrganizedEvents(w http.ResponseWriter, r *http.Request) {
	var req struct{
		User_ID int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if  strconv.Itoa(req.User_ID) == ""  {
		http.Error(w, "User Id is required", http.StatusBadRequest)
		return
	}
	query := ` SELECT e.id, e.name
			   FROM events e
			   JOIN event_participants ep ON ep.event_id = e.id
				WHERE ep.user_id = ? AND ep.role = ? `

	rows,err:= h.DB.Query(query,req.User_ID,models.Role.Organizer)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var Events []models.Event
	for rows.Next(){
		var e models.Event
		if err= rows.Scan(&e.ID, &e.Name); err!=nil{
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		Events = append(Events,e)
	}
	if len(Events) == 0{
		http.Error(w , "no Organized Events", http.StatusNotFound)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Events)
}

//Returns A list of events Invited in by User via the passed UserID
func (h *EventHandler) GetInvitedEvents(w http.ResponseWriter, r *http.Request) {
	var req struct{
		User_ID int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if  strconv.Itoa(req.User_ID) == ""  {
		http.Error(w, "User Id is required", http.StatusBadRequest)
		return
	}
	query := ` SELECT e.id, e.name
			   FROM events e
			   JOIN event_participants ep ON ep.event_id = e.id
				WHERE ep.user_id = ? AND ep.role = ? `

	rows,err:= h.DB.Query(query,req.User_ID,models.Role.Invitee)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var Events []models.Event
	for rows.Next(){
		var e models.Event
		if err= rows.Scan(&e.ID, &e.Name); err!=nil{
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		Events = append(Events,e)
	}
	if len(Events) == 0{
		http.Error(w , "Not invited to Events", http.StatusNotFound)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Events)
}
// Invites User to Event with a certain role
func (h *EventHandler) InviteUser(w http.ResponseWriter, r *http.Request) {
	var req models.InviteUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if  strconv.Itoa(req.UserID) == "" || strconv.Itoa(req.EventID) == "" {
		http.Error(w, "InviteeID and EventID are required as: user_id and event_id", http.StatusBadRequest)
		return
	}
	query := `
			INSERT INTO event_participants (event_id, user_id, role, status)
			VALUES (?, ?, ?, ?)
		`
	_,err:= h.DB.Exec(query, req.EventID, req.UserID , req.Role,models.Status.NotGoing)
	if err!=nil{
		http.Error(w,fmt.Sprintf("Failed to invite User : %v \n", err),http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message" : "User Invited Successfully",
	})
}
