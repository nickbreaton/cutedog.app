// id: number;
// datetime: string;
// timezone: Timezone;
// quotes: string[];
// lat: number;
// lon: number;
// photoID?: string;
// description?: string;

import { getConnection } from "../database";
import { getLocalOffset, getUTCDateTime } from "../date";
import { Interaction } from "../types";

// 2023-07-03 2:00 pm

/**
 * Use this as seed data in dev, but is the actual beginning of real data.
 * All times are in EDT.
 */
export async function seedAction(form: FormData) {
  const source = [
    // {
    //   quote: [''],
    //   date: new Date(''),
    //   description: '',
    //   coords: [],
    // },
    {
      quote: ["Cute dog"],
      date: new Date("2023-07-01 3:38 pm EDT"),
      description: "",
      coords: [32.786031, -79.931598],
    },
    {
      quote: ["Oh my god your dog is so adorable, what’s her name?"],
      date: new Date("2023-07-01 5:26 pm EDT"),
      description: "Woman stops car to roll down window and yell.",
      coords: [32.776921, -79.927754],
    },
    {
      quote: ["Oh my god, do you see this little dog?"],
      date: new Date("2023-07-02 11:26 am EDT"),
      description: "Eating a treat in a bookstore.",
      coords: [32.778168, -79.932823],
    },
    {
      quote: ["Oh my god I love her so much"],
      date: new Date("2023-07-02 11:35 am EDT"),
      description: "",
      coords: [32.778168, -79.932823],
    },
    {
      quote: ["Did you see this little one over here?!"],
      date: new Date("2023-07-02 11:52 am EDT"),
      description: "",
      coords: [32.77698, -79.933042],
    },
    {
      quote: ["Your baby is cute"],
      date: new Date("2023-07-02 1:30 pm EDT"),
      description: "",
      coords: [32.77944, -79.930072],
    },
    {
      quote: ["Pretty precious"],
      date: new Date("2023-07-01 6:07 pm EDT"),
      description: "Walking around the oceanfront park.",
      coords: [32.769662, -79.928938],
    },
    {
      quote: [
        "What’s her name, i have to ask?",
        "Lucy oh my god what a sweet old face. That’s my favorite kind of dog.",
      ],
      date: new Date("2023-07-01 8:19 pm EDT"),
      description: "Server serving dessert to us on an outdoor patio.",
      coords: [32.781373, -79.930061],
      photoId: "cutedog-prod/cuzchxhtj63zkanofnpb",
    },
    {
      quote: ["I like your dog"],
      date: new Date("2023-07-02 12:25 am EDT"),
      description: "Greeted by bookstore clerk.",
      coords: [32.778168, -79.932823],
      photoId: "cutedog-prod/rjod8qur0mwhta7t9nro",
    },
    {
      quote: ["That dog is so cute."],
      date: new Date("2023-07-02 12:15 pm EDT"),
      description: "",
      coords: [32.776325, -79.930678],
      photoId: "cutedog-prod/ioqhmjblr6mhbhbgc66s",
    },
    {
      quote: ["Awe I love little dogs"],
      date: new Date("2023-07-01 6:48 pm EDT"),
      description: "Ordering at a coffee shop",
      coords: [32.781261, -79.929855],
      photoId: "cutedog-prod/aehtqespv4otn55ud56a",
    },
    {
      quote: ["Awe. I miss my dog so much. I had a chihuahua."],
      date: new Date("2023-07-03 11:19 am EDT"),
      description: "",
      coords: [32.789694, -79.939121],
      photoId: "cutedog-prod/h2etidosbvero5iqmfyc",
    },
    {
      quote: ["I like your dog"],
      date: new Date("2023-07-03 11:16 am EDT"),
      description: "Little kid after smiling at her at her through a window.",
      coords: [32.789694, -79.939121],
      photoId: "cutedog-prod/oezfo05knchnrdmnpwwm",
    },
  ];

  const interactions = source.map(
    (record): Omit<Interaction, "id"> => ({
      datetime: getUTCDateTime(record.date),
      timezone: "-0400",
      lat: record.coords[0],
      lon: record.coords[1],
      quotes: record.quote,
      description: record.description || undefined,
      photoID: record.photoId,
    })
  );

  for (const interaction of interactions) {
    await getConnection().execute(
      "insert into interactions (quotes, datetime, timezone, lat, lon, photoID, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        JSON.stringify(interaction.quotes),
        interaction.datetime,
        interaction.timezone,
        interaction.lat,
        interaction.lon,
        interaction.photoID,
        interaction.description,
      ]
    );
  }
}
