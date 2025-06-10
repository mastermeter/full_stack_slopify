import eventsData from './data/eventsData.js'; // Tes événements par défaut
import { getDb } from './db.js';
import { eventSchema } from './schemas/eventSchema.js'; // (Optionnel, si tu utilises SimpleSchema)
import {v4 as uuidv4} from 'uuid' // Pour générer des UUIDs uniques
export async function initEvents() {
  const db = getDb();
  const collection = db.collection('events');

  for (const event of eventsData) {
    try {
      // Vérifier et nettoyer les événements avec SimpleSchema (si utilisé)
      // eventSchema.clean(event, { mutate: true });
      // eventSchema.validate(event);

      // Vérifie si l'événement existe déjà par son nom
      const exists = await collection.findOne({ name: event.name });
      if (!exists) {
        eventSchema.validate(event);
        await collection.insertOne({...event,id:uuidv4()});
        console.log(`✅ Événement ajouté : ${event.name}`);
      }
    } catch (err) {
      console.error(`❌ Erreur sur l'événement "${event.name}" :`, err.message);
    }
  }
}