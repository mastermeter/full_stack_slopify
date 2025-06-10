import SimpleSchema from 'simpl-schema';

export const userSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email, // Vérifie que l'email est valide
    
  },
  password: {
    type: String,
    min: 8, // Minimum de 8 caractères pour le mot de passe
  },
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
});
