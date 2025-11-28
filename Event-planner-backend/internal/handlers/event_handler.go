package handlers

import (
	"database/sql"
	"encoding/json"
	"eventplanner-backend/internal/models"
	"fmt"
	"net/http"
	"strconv"
)

// handle Event operations
type EventHandler struct{ DB *sql.DB }

func NewEventHandler(db *sql.DB) *EventHandler { return &EventHandler{DB: db} }

// Returns A list of events organized by User via the passed UserID
func (h *EventHandler) GetOrganizedEvents(w http.ResponseWriter, r *http.Request) {
	var req struct {
		User_ID int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strconv.Itoa(req.User_ID) == "" {
		http.Error(w, "User Id is required", http.StatusBadRequest)
		return
	}
	query := ` SELECT e.id, e.name, e.date, e.time, e.location, e.description, e.organizer_id, e.created_at, e.updated_at
			   FROM events e
			   JOIN event_participants ep ON ep.event_id = e.id
				WHERE ep.user_id = ? AND ep.role = ? `

	rows, err := h.DB.Query(query, req.User_ID, models.Role.Organizer)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var Events []models.Event
	for rows.Next() {
		var e models.Event
		if err = rows.Scan(&e.ID, &e.Name, &e.Date, &e.Time, &e.Location, &e.Description, &e.OrganizerID, &e.CreatedAt, &e.UpdatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		Events = append(Events, e)
	}
	if len(Events) == 0 {
		http.Error(w, "no Organized Events", http.StatusNotFound)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Events)
}

// Returns A list of events Invited in by User via the passed UserID
func (h *EventHandler) GetInvitedEvents(w http.ResponseWriter, r *http.Request) {
	var req struct {
		User_ID int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strconv.Itoa(req.User_ID) == "" {
		http.Error(w, "User Id is required", http.StatusBadRequest)
		return
	}
	query := ` SELECT e.id, e.name, e.date, e.time, e.location, e.description, e.organizer_id, e.created_at, e.updated_at
			   FROM events e
			   JOIN event_participants ep ON ep.event_id = e.id
				WHERE ep.user_id = ? AND (ep.role = ? OR ep.role = ?) `

	rows, err := h.DB.Query(query, req.User_ID, models.Role.Invitee, models.Role.Collaborator)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var Events []models.Event
	for rows.Next() {
		var e models.Event
		if err = rows.Scan(&e.ID, &e.Name, &e.Date, &e.Time, &e.Location, &e.Description, &e.OrganizerID, &e.CreatedAt, &e.UpdatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		Events = append(Events, e)
	}
	if len(Events) == 0 {
		http.Error(w, "Not invited to Events", http.StatusNotFound)
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

	if strconv.Itoa(req.UserID) == "" || strconv.Itoa(req.EventID) == "" {
		http.Error(w, "InviteeID and EventID are required as: user_id and event_id", http.StatusBadRequest)
		return
	}
	query := `
			INSERT INTO event_participants (event_id, user_id, role, status)
			VALUES (?, ?, ?, ?)
		`
	_, err := h.DB.Exec(query, req.EventID, req.UserID, req.Role, models.Status.NotGoing)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to invite User : %v \n", err), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User Invited Successfully",
	})
}

// Creates a new event and marks the creator as organizer
func (h *EventHandler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		models.CreateEventRequest
		UserID int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Date == "" || req.Time == "" || req.Location == "" {
		http.Error(w, "Name, date, time, and location are required", http.StatusBadRequest)
		return
	}

	// Insert event
	result, err := h.DB.Exec(
		"INSERT INTO events (name, date, time, location, description, organizer_id) VALUES (?, ?, ?, ?, ?, ?)",
		req.Name, req.Date, req.Time, req.Location, req.Description, req.UserID,
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to create event: %v", err), http.StatusInternalServerError)
		return
	}

	eventID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Add creator as organizer in event_participants
	_, err = h.DB.Exec(
		"INSERT INTO event_participants (event_id, user_id, role, status) VALUES (?, ?, ?, ?)",
		eventID, req.UserID, models.Role.Organizer, models.Status.Going,
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to add organizer: %v", err), http.StatusInternalServerError)
		return
	}

	// Fetch the created event
	var event models.Event
	err = h.DB.QueryRow(
		"SELECT id, name, date, time, location, description, organizer_id, created_at, updated_at FROM events WHERE id = ?",
		eventID,
	).Scan(&event.ID, &event.Name, &event.Date, &event.Time, &event.Location, &event.Description, &event.OrganizerID, &event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(event)
}

// Deletes an event (only organizer can delete)
func (h *EventHandler) DeleteEvent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		EventID int `json:"event_id"`
		UserID  int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if user is the organizer
	var organizerID int
	err := h.DB.QueryRow("SELECT organizer_id FROM events WHERE id = ?", req.EventID).Scan(&organizerID)
	if err == sql.ErrNoRows {
		http.Error(w, "Event not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if organizerID != req.UserID {
		http.Error(w, "Only the organizer can delete this event", http.StatusForbidden)
		return
	}

	// Delete event (cascade will delete event_participants)
	_, err = h.DB.Exec("DELETE FROM events WHERE id = ?", req.EventID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete event: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Event deleted successfully",
	})
}

// Updates an event (only organizer can update)
func (h *EventHandler) UpdateEvent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		EventID int `json:"event_id"`
		UserID  int `json:"user_id"`
		models.UpdateEventRequest
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if user is the organizer
	var organizerID int
	err := h.DB.QueryRow("SELECT organizer_id FROM events WHERE id = ?", req.EventID).Scan(&organizerID)
	if err == sql.ErrNoRows {
		http.Error(w, "Event not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if organizerID != req.UserID {
		http.Error(w, "Only the organizer can update this event", http.StatusForbidden)
		return
	}

	if req.Name == "" || req.Date == "" || req.Time == "" || req.Location == "" {
		http.Error(w, "Name, date, time, and location are required", http.StatusBadRequest)
		return
	}

	// Update event
	_, err = h.DB.Exec(
		"UPDATE events SET name = ?, date = ?, time = ?, location = ?, description = ? WHERE id = ?",
		req.Name, req.Date, req.Time, req.Location, req.Description, req.EventID,
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to update event: %v", err), http.StatusInternalServerError)
		return
	}

	// Fetch the updated event
	var event models.Event
	err = h.DB.QueryRow(
		"SELECT id, name, date, time, location, description, organizer_id, created_at, updated_at FROM events WHERE id = ?",
		req.EventID,
	).Scan(&event.ID, &event.Name, &event.Date, &event.Time, &event.Location, &event.Description, &event.OrganizerID, &event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}

// Sets attendance status for a user for an event
func (h *EventHandler) SetStatus(w http.ResponseWriter, r *http.Request) {
	var req models.SetStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Status != string(models.Status.Going) && req.Status != string(models.Status.NotGoing) && req.Status != string(models.Status.Maybe) {
		http.Error(w, "Invalid status. Must be 'Going', 'Not Going', or 'Maybe'", http.StatusBadRequest)
		return
	}

	// Update status
	result, err := h.DB.Exec(
		"UPDATE event_participants SET status = ? WHERE event_id = ? AND user_id = ?",
		req.Status, req.EventID, req.UserID,
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to update status: %v", err), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "User is not a participant of this event", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Status updated successfully",
		"status":  req.Status,
	})
}

// Gets all attendees for an event with their status
func (h *EventHandler) GetAttendees(w http.ResponseWriter, r *http.Request) {
	var req struct {
		EventID int `json:"event_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query := `
		SELECT u.id, u.first_name, u.last_name, u.email, ep.status, ep.role
		FROM event_participants ep
		JOIN users u ON ep.user_id = u.id
		WHERE ep.event_id = ?
	`

	rows, err := h.DB.Query(query, req.EventID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var attendees []models.AttendeeResponse
	for rows.Next() {
		var a models.AttendeeResponse
		if err = rows.Scan(&a.UserID, &a.FirstName, &a.LastName, &a.Email, &a.Status, &a.Role); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		attendees = append(attendees, a)
	}

	if len(attendees) == 0 {
		http.Error(w, "No attendees found for this event", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(attendees)
}

// Gets full event details by event ID
func (h *EventHandler) GetEventDetails(w http.ResponseWriter, r *http.Request) {
	var req struct {
		EventID int `json:"event_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var event models.Event
	err := h.DB.QueryRow(
		"SELECT id, name, date, time, location, description, organizer_id, created_at, updated_at FROM events WHERE id = ?",
		req.EventID,
	).Scan(&event.ID, &event.Name, &event.Date, &event.Time, &event.Location, &event.Description, &event.OrganizerID, &event.CreatedAt, &event.UpdatedAt)

	if err == sql.ErrNoRows {
		http.Error(w, "Event not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}

// Invite user by email with role
func (h *EventHandler) InviteUserByEmail(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email   string `json:"email"`
		EventID int    `json:"event_id"`
		Role    string `json:"role"`
		UserID  int    `json:"user_id"` // Organizer's ID
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate role
	if req.Role != string(models.Role.Invitee) && req.Role != string(models.Role.Collaborator) {
		http.Error(w, "Invalid role. Must be 'invitee' or 'collaborator'", http.StatusBadRequest)
		return
	}

	// Check if requester is the organizer
	var organizerID int
	err := h.DB.QueryRow("SELECT organizer_id FROM events WHERE id = ?", req.EventID).Scan(&organizerID)
	if err == sql.ErrNoRows {
		http.Error(w, "Event not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if organizerID != req.UserID {
		http.Error(w, "Only the organizer can invite users", http.StatusForbidden)
		return
	}

	// Find user by email
	var inviteeID int
	err = h.DB.QueryRow("SELECT id FROM users WHERE email = ?", req.Email).Scan(&inviteeID)
	if err == sql.ErrNoRows {
		http.Error(w, "User with this email not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Check if user is already invited
	var count int
	err = h.DB.QueryRow("SELECT COUNT(*) FROM event_participants WHERE event_id = ? AND user_id = ?", req.EventID, inviteeID).Scan(&count)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "User is already invited to this event", http.StatusConflict)
		return
	}

	// Insert invitation
	_, err = h.DB.Exec(
		"INSERT INTO event_participants (event_id, user_id, role, status) VALUES (?, ?, ?, ?)",
		req.EventID, inviteeID, req.Role, models.Status.NotGoing,
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to invite user: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User invited successfully",
	})
}

// Advanced search/filter for events
func (h *EventHandler) SearchEvents(w http.ResponseWriter, r *http.Request) {
	var req models.SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query := `
		SELECT DISTINCT e.id, e.name, e.date, e.time, e.location, e.description, e.organizer_id, e.created_at, e.updated_at
		FROM events e
		LEFT JOIN event_participants ep ON e.id = ep.event_id
		WHERE 1=1
	`
	args := []interface{}{}

	// Filter by keyword (event name or description)
	if req.Keyword != "" {
		query += " AND (e.name LIKE ? OR e.description LIKE ?)"
		searchTerm := "%" + req.Keyword + "%"
		args = append(args, searchTerm, searchTerm)
	}

	// Filter by start date
	if req.StartDate != "" {
		query += " AND e.date >= ?"
		args = append(args, req.StartDate)
	}

	// Filter by end date
	if req.EndDate != "" {
		query += " AND e.date <= ?"
		args = append(args, req.EndDate)
	}

	// Filter by user role (if provided)
	if req.UserID > 0 && req.Role != "" {
		query += " AND ep.user_id = ? AND ep.role = ?"
		args = append(args, req.UserID, req.Role)
	} else if req.UserID > 0 {
		query += " AND ep.user_id = ?"
		args = append(args, req.UserID)
	}

	query += " ORDER BY e.date ASC, e.time ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, fmt.Sprintf("Search failed: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var e models.Event
		if err = rows.Scan(&e.ID, &e.Name, &e.Date, &e.Time, &e.Location, &e.Description, &e.OrganizerID, &e.CreatedAt, &e.UpdatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		events = append(events, e)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}
