import SimpleSchema from 'simpl-schema';

export const eventSchema = new SimpleSchema({
  name: String,
  dateFrom: String,
  dateTo: String,
  location: {
    type: Array,
    minCount: 2,
    maxCount: 2,
  },
  'location.$': Number,
  artists: [
    {
      id: String,
      name: String,
      href: String,
      imgUrl: String,
    },
  ],
});

