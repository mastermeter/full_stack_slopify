// src/MyEvents.jsx
import React, { useState } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Stack, Container, Card, CardContent, CardActions, IconButton
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_EVENTS = gql`
  query {
    events {
      id
      name
      dateFrom
      dateTo
      location
      artists
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($name: String!, $dateFrom: String!, $dateTo: String!, $artists: [JSON], $location: [Float]) {
    createEvent(name: $name, dateFrom: $dateFrom, dateTo: $dateTo, artists: $artists, location: $location) {
      id
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($eventId: ID!, $name: String!, $dateFrom: String!, $dateTo: String!, $artists: [JSON], $location: [Float]) {
    updateEvent(eventId: $eventId, name: $name, dateFrom: $dateFrom, dateTo: $dateTo, artists: $artists, location: $location) {
      id
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId)
  }
`;

export default function MyEvents() {
  const { data, loading, error, refetch } = useQuery(GET_EVENTS);
  const [createEvent] = useMutation(CREATE_EVENT);
  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    dateFrom: "",
    dateTo: "",
    artists: "",
    locationX: "",
    locationY: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
      artists: form.artists.split(",").map((n) => ({ name: n.trim() })),
      location: [parseFloat(form.locationX), parseFloat(form.locationY)],
    };

    try {
      if (editingEvent) {
        await updateEvent({ variables: { eventId: editingEvent.id, ...payload } });
      } else {
        await createEvent({ variables: payload });
      }
      await refetch();
      setOpen(false);
      setForm({ name: "", dateFrom: "", dateTo: "", artists: "", locationX: "", locationY: "" });
      setEditingEvent(null);
    } catch (err) {
      console.error("Erreur mutation:", err);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      name: event.name,
      dateFrom: event.dateFrom,
      dateTo: event.dateTo,
      artists: event.artists.map(a => a.name).join(", "),
      locationX: event.location[0],
      locationY: event.location[1],
    });
    setOpen(true);
  };

  const handleDelete = async (eventId) => {
    await deleteEvent({ variables: { eventId } });
    await refetch();
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <Container sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Container display="flex" justifycontent="space-between" alignitems="center">
          <Typography variant="h5" sx={{ mb: 2 }}>Mes événements</Typography>
          <IconButton onClick={() => setOpen(true)}><Add /></IconButton>
        </Container>

        {data.events.map((event) => (
          <Card key={event.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{event.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {event.artists.map(a => a.name).join(", ")}
              </Typography>
              <Typography variant="body2">
                {event.dateFrom} - {event.dateTo}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleEdit(event)}><Edit /></IconButton>
              <IconButton onClick={() => handleDelete(event.id)}><Delete /></IconButton>
            </CardActions>
          </Card>
        ))}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingEvent ? "Modifier" : "Nouvel événement"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nom de l'événement" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label="Date de début" name="dateFrom" value={form.dateFrom} onChange={handleChange} fullWidth />
            <TextField label="Date de fin" name="dateTo" value={form.dateTo} onChange={handleChange} fullWidth />
            <TextField label="Artistes" name="artists" value={form.artists} onChange={handleChange} fullWidth />
            <TextField label="Latitude" name="locationX" value={form.locationX} onChange={handleChange} fullWidth />
            <TextField label="Longitude" name="locationY" value={form.locationY} onChange={handleChange} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? "Mettre à jour" : "Confirmer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}